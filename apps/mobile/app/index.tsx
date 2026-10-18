import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import * as Haptics from "expo-haptics";
import {
  KinetixRealtimeBridge,
  ComplexityLevel,
  RegisterMode,
  DEMO_SCENARIOS,
} from "@kinetix/shared";

export default function KinetixFieldInstrument() {
  const [sessionId, setSessionId] = useState("SHUNYA-8842");
  const [complexity, setComplexity] = useState<ComplexityLevel>(2);
  const [registerMode, setRegisterMode] = useState<RegisterMode>("DIRECT");
  const [intentText, setIntentText] = useState(
    DEMO_SCENARIOS.scholarship.sampleVoiceIntent
  );
  const bridgeRef = useRef<KinetixRealtimeBridge | null>(null);

  useEffect(() => {
    const bridge = new KinetixRealtimeBridge(
      sessionId,
      process.env.EXPO_PUBLIC_SUPABASE_URL,
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    );
    bridgeRef.current = bridge;

    bridge.emit({
      type: "BRIDGE_PAIR",
      sessionId,
      deviceName: "EXPO-FIELD-LENS-NATIVE",
      timestamp: Date.now(),
    });

    return () => bridge.destroy();
  }, [sessionId]);

  const handleDialPress = async (level: ComplexityLevel) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setComplexity(level);
    await bridgeRef.current?.emit({
      type: "COMPLEXITY_DIAL_CHANGE",
      sessionId,
      level,
      source: "mobile",
      timestamp: Date.now(),
    });
  };

  const handleRegisterPress = async (register: RegisterMode) => {
    await Haptics.selectionAsync();
    setRegisterMode(register);
    await bridgeRef.current?.emit({
      type: "REGISTER_MODE_CHANGE",
      sessionId,
      register,
      source: "mobile",
      timestamp: Date.now(),
    });
  };

  const handleBeamScenario = async (
    scenarioId: "scholarship" | "tenancy" | "architecture"
  ) => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const preset = DEMO_SCENARIOS[scenarioId];
    setIntentText(preset.sampleVoiceIntent);
    await bridgeRef.current?.emit({
      type: "INTENT_CAPTURED",
      sessionId,
      scenarioId,
      rawText: preset.rawDocumentSnippet,
      voiceIntentTranscript: preset.sampleVoiceIntent,
      timestamp: Date.now(),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Bar */}
        <View style={styles.headerBanner}>
          <Text style={styles.headerMono}>
            [KINETIX // TACTILE FIELD INSTRUMENT]
          </Text>
          <Text style={styles.headerRoom}>ROOM: {sessionId}</Text>
        </View>

        {/* Room Pairing Input */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>01 // BRIDGE SESSION PAIRING</Text>
          <TextInput
            value={sessionId}
            onChangeText={setSessionId}
            style={styles.input}
            placeholder="Enter Web Room Code (e.g. SHUNYA-8842)"
          />
        </View>

        {/* Tactile Complexity Dial */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>
            02 // PHYSICAL COMPLEXITY DIAL (HAPTIC SYNC)
          </Text>
          <View style={styles.row}>
            {([1, 2, 3] as ComplexityLevel[]).map((lvl) => (
              <TouchableOpacity
                key={lvl}
                onPress={() => handleDialPress(lvl)}
                style={[
                  styles.dialBtn,
                  complexity === lvl && styles.dialBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.dialCode,
                    complexity === lvl && styles.dialTextActive,
                  ]}
                >
                  0{lvl}
                </Text>
                <Text
                  style={[
                    styles.dialCaption,
                    complexity === lvl && styles.dialTextActive,
                  ]}
                >
                  {lvl === 1 ? "ELI10" : lvl === 2 ? "EXEC" : "AUTO"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Register Mode Selector */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>
            03 // ENGLISH SEMANTIC REGISTER
          </Text>
          <View style={styles.row}>
            {(["PLAIN", "DIRECT", "STATUTORY"] as RegisterMode[]).map((reg) => (
              <TouchableOpacity
                key={reg}
                onPress={() => handleRegisterPress(reg)}
                style={[
                  styles.regBtn,
                  registerMode === reg && styles.regBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.regText,
                    registerMode === reg && styles.dialTextActive,
                  ]}
                >
                  {reg}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Field Artifact Capture Presets */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>
            04 // SCAN & BEAM ARTIFACT TO WEB CANVAS
          </Text>
          <TextInput
            value={intentText}
            onChangeText={setIntentText}
            multiline
            style={[styles.input, { height: 72, marginBottom: 10 }]}
          />
          {(["scholarship", "tenancy", "architecture"] as const).map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => handleBeamScenario(key)}
              style={styles.beamBtn}
            >
              <Text style={styles.beamBtnText}>
                SCAN & BEAM: {DEMO_SCENARIOS[key].label.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F1EA" },
  container: { padding: 16, gap: 16 },
  headerBanner: {
    backgroundColor: "#111110",
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerMono: { color: "#FF4F00", fontWeight: "700", fontSize: 12 },
  headerRoom: { color: "#F4F1EA", fontWeight: "700", fontSize: 12 },
  card: {
    backgroundColor: "#EAE5D9",
    borderWidth: 2,
    borderColor: "#111110",
    padding: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111110",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F4F1EA",
    borderWidth: 1,
    borderColor: "#111110",
    padding: 10,
    fontSize: 13,
    color: "#111110",
  },
  row: { flexDirection: "row", gap: 8 },
  dialBtn: {
    flex: 1,
    backgroundColor: "#F4F1EA",
    borderWidth: 2,
    borderColor: "#111110",
    paddingVertical: 14,
    alignItems: "center",
  },
  dialBtnActive: { backgroundColor: "#FF4F00" },
  dialCode: { fontSize: 18, fontWeight: "800", color: "#111110" },
  dialCaption: { fontSize: 10, fontWeight: "600", color: "#111110" },
  dialTextActive: { color: "#F4F1EA" },
  regBtn: {
    flex: 1,
    backgroundColor: "#F4F1EA",
    borderWidth: 1,
    borderColor: "#111110",
    paddingVertical: 10,
    alignItems: "center",
  },
  regBtnActive: { backgroundColor: "#111110" },
  regText: { fontSize: 11, fontWeight: "700", color: "#111110" },
  beamBtn: {
    backgroundColor: "#FF4F00",
    borderWidth: 2,
    borderColor: "#111110",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  beamBtnText: {
    color: "#F4F1EA",
    fontWeight: "800",
    fontSize: 11,
    textAlign: "center",
  },
});
