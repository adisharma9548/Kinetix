import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { BridgeEvent, BridgeEventSchema } from "./schemas";

export class KinetixRealtimeBridge {
  private sessionId: string;
  private supabaseChannel: RealtimeChannel | null = null;
  private localBroadcast: BroadcastChannel | null = null;
  private listeners: Set<(event: BridgeEvent) => void> = new Set();

  constructor(
    sessionId: string,
    supabaseUrl?: string,
    supabaseAnonKey?: string
  ) {
    this.sessionId = sessionId;
    const channelName = `kinetix:bridge:${sessionId}`;

    // 1. Local ultra-low-latency BroadcastChannel (Simulator <-> Web & Cross-Tab)
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.localBroadcast = new BroadcastChannel(channelName);
      this.localBroadcast.onmessage = (msg) => {
        const parsed = BridgeEventSchema.safeParse(msg.data);
        if (parsed.success) {
          this.notifyListeners(parsed.data);
        }
      };
    }

    // 2. Supabase Realtime WebSocket Broadcast (Physical Mobile <-> Web)
    if (
      supabaseUrl &&
      supabaseAnonKey &&
      supabaseUrl.startsWith("http") &&
      !supabaseUrl.includes("your-project")
    ) {
      try {
        const client = createClient(supabaseUrl, supabaseAnonKey, {
          realtime: { params: { eventsPerSecond: 40 } },
        });
        this.supabaseChannel = client.channel(channelName, {
          config: { broadcast: { self: false, ack: false } },
        });

        this.supabaseChannel
          .on("broadcast", { event: "kinetix_signal" }, ({ payload }) => {
            const parsed = BridgeEventSchema.safeParse(payload);
            if (parsed.success) {
              this.notifyListeners(parsed.data);
            }
          })
          .subscribe();
      } catch {
        // Gracefully operate on local transport if Supabase is unreachable
      }
    }
  }

  public onEvent(callback: (event: BridgeEvent) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public async emit(event: BridgeEvent): Promise<void> {
    this.notifyListeners(event);

    if (this.localBroadcast) {
      this.localBroadcast.postMessage(event);
    }

    if (this.supabaseChannel) {
      await this.supabaseChannel.send({
        type: "broadcast",
        event: "kinetix_signal",
        payload: event,
      });
    }
  }

  private notifyListeners(event: BridgeEvent) {
    this.listeners.forEach((cb) => cb(event));
  }

  public destroy() {
    if (this.localBroadcast) {
      this.localBroadcast.close();
    }
    if (this.supabaseChannel) {
      this.supabaseChannel.unsubscribe();
    }
    this.listeners.clear();
  }
}
