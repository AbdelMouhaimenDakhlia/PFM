import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  Alert,
  Animated,
  Vibration,
  ActivityIndicator,
  Easing,ImageBackground
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import * as Haptics from "expo-haptics";
import api from "../services/api";
import { NavigationProps } from "../navigation/routes";
import { AuthContext } from "../context/AuthContext";
import { useAppTheme } from "../context/ThemeContext";

interface ValidationErrors {
  email?: string;
  motDePasse?: string;
}

interface ValidationState {
  email: "idle" | "validating" | "valid" | "invalid";
  motDePasse: "idle" | "validating" | "valid" | "invalid";
}

interface BiometricState {
  isAvailable: boolean;
  isEnabled: boolean;
  biometricType: "TouchID" | "FaceID" | "Fingerprint" | null;
  hasStoredCredentials: boolean;
}

export default function LoginScreen({ navigation }: NavigationProps<"Login">) {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [validationState, setValidationState] = useState<ValidationState>({
    email: "idle",
    motDePasse: "idle",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [biometricState, setBiometricState] = useState<BiometricState>({
    isAvailable: false,
    isEnabled: false,
    biometricType: null,
    hasStoredCredentials: false,
  });
  const { setToken } = useContext(AuthContext);

  //theme
  const { theme, themeType, setThemeType } = useAppTheme();
  const toggleTheme = () => {
  const newTheme = themeType === 'dark' ? 'light' : 'dark';
  setThemeType(newTheme);

  // Vibration douce
  Vibration.vibrate(100);

  // Petit message (Toast Android)
  if (Platform.OS === 'android') {
    ToastAndroid.show(
      newTheme === 'dark' ? '🌙 Thème sombre activé' : '🌞 Thème clair activé',
      ToastAndroid.SHORT
    );
  }
};
  const knobTranslate = useRef(
    new Animated.Value(themeType === "dark" ? 30 : 2)
  ).current;

  useEffect(() => {
    Animated.timing(knobTranslate, {
      toValue: themeType === "dark" ? 30 : 2,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [themeType]);

  // Animations
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const errorOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Animation de pulsation pour l'icône biométrique
  useEffect(() => {
    if (biometricState.isAvailable && biometricState.hasStoredCredentials) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [biometricState]);

  // Auto-focus sur le premier champ
  useEffect(() => {
    const timer = setTimeout(() => {
      emailInputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Vérification de la disponibilité biométrique
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const [showBiometric, setShowBiometric] = useState(false);
  useEffect(() => {
  const checkBiometricSetting = async () => {
    const isEnabled = await AsyncStorage.getItem('biometric_enabled');
    setShowBiometric(isEnabled === 'true');
  };
  checkBiometricSetting();
}, []);


  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      const hasStoredCredentials = await AsyncStorage.getItem(
        "biometric_credentials"
      );

      setBiometricState({
        isAvailable: compatible && enrolled,
        isEnabled: compatible && enrolled,
        biometricType: enrolled ? "Fingerprint" : null, // simplification
        hasStoredCredentials: !!hasStoredCredentials,
      });
    } catch (error) {
      console.log("Biometric not supported:", error);
      setBiometricState({
        isAvailable: false,
        isEnabled: false,
        biometricType: null,
        hasStoredCredentials: false,
      });
    }
  };

  // Fonction de validation de l'email en temps réel
  const validateEmailRealTime = (
    email: string
  ): { isValid: boolean; error?: string } => {
    if (!email.trim()) {
      return { isValid: false, error: "L'email est requis" };
    }
    if (email.length < 3) {
      return { isValid: false, error: "Email trop court" };
    }
    if (!email.includes("@")) {
      return { isValid: false, error: "Format d'email invalide" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Format d'email invalide" };
    }
    return { isValid: true };
  };

  // Fonction de validation du mot de passe en temps réel
  const validatePasswordRealTime = (
    password: string
  ): { isValid: boolean; error?: string } => {
    if (!password.trim()) {
      return { isValid: false, error: "Le mot de passe est requis" };
    }
    if (password.length < 6) {
      return { isValid: false, error: "Minimum 6 caractères" };
    }
    return { isValid: true };
  };

  // Animation de secousse pour les erreurs
  const triggerShakeAnimation = () => {
    if (Platform.OS === "ios") {
      Vibration.vibrate(100);
    } else {
      Vibration.vibrate([0, 100]);
    }

    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animation d'apparition/disparition des erreurs
  const animateError = (show: boolean) => {
    Animated.timing(errorOpacity, {
      toValue: show ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Animation du bouton
  const animateButton = (pressed: boolean) => {
    Animated.spring(buttonScale, {
      toValue: pressed ? 0.95 : 1,
      useNativeDriver: true,
    }).start();
  };

  // Validation en temps réel avec debouncing
  const handleEmailChange = (text: string) => {
    setEmail(text);

    // Validation immédiate pour les cas évidents
    const validation = validateEmailRealTime(text);

    if (text.length === 0) {
      setValidationState((prev) => ({ ...prev, email: "idle" }));
      setErrors((prev) => ({ ...prev, email: undefined }));
      return;
    }

    setValidationState((prev) => ({ ...prev, email: "validating" }));

    // Debounced validation
    const timer = setTimeout(() => {
      if (validation.isValid) {
        setValidationState((prev) => ({ ...prev, email: "valid" }));
        setErrors((prev) => ({ ...prev, email: undefined }));
      } else {
        setValidationState((prev) => ({ ...prev, email: "invalid" }));
        setErrors((prev) => ({ ...prev, email: validation.error }));
        animateError(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  };

  // Validation en temps réel du mot de passe
  const handlePasswordChange = (text: string) => {
    setMotDePasse(text);

    const validation = validatePasswordRealTime(text);

    if (text.length === 0) {
      setValidationState((prev) => ({ ...prev, motDePasse: "idle" }));
      setErrors((prev) => ({ ...prev, motDePasse: undefined }));
      return;
    }

    setValidationState((prev) => ({ ...prev, motDePasse: "validating" }));

    const timer = setTimeout(() => {
      if (validation.isValid) {
        setValidationState((prev) => ({ ...prev, motDePasse: "valid" }));
        setErrors((prev) => ({ ...prev, motDePasse: undefined }));
      } else {
        setValidationState((prev) => ({ ...prev, motDePasse: "invalid" }));
        setErrors((prev) => ({ ...prev, motDePasse: validation.error }));
        animateError(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  };

  // Fonction de validation finale
  const validateForm = (): boolean => {
    const emailValidation = validateEmailRealTime(email);
    const passwordValidation = validatePasswordRealTime(motDePasse);

    const newErrors: ValidationErrors = {};

    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    if (!passwordValidation.isValid) {
      newErrors.motDePasse = passwordValidation.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerShakeAnimation();
      animateError(true);
      return false;
    }

    return true;
  };

  // Gestion des tentatives de connexion
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    await performLogin(email.trim(), motDePasse);
  };

  // Fonction de connexion réutilisable
  const performLogin = async (userEmail: string, userPassword: string) => {
    // Vérification des tentatives
    if (loginAttempts >= 3) {
      Alert.alert(
        "🔒 Trop de tentatives",
        "Veuillez attendre avant de réessayer.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsLoading(true);
    animateButton(true);

    try {
      const res = await api.post("/auth/login", {
        email: userEmail,
        motDePasse: userPassword,
      });

      const token = res.data.token;
      await AsyncStorage.setItem("token", token);

      // Proposer de sauvegarder les identifiants pour la biométrie
      if (biometricState.isAvailable && !biometricState.hasStoredCredentials) {
        showBiometricSetupPrompt(userEmail, userPassword);
      }

      // Reset des tentatives en cas de succès
      setLoginAttempts(0);

      if (Platform.OS === "android") {
        ToastAndroid.show("✅ Connexion réussie", ToastAndroid.SHORT);
      } else {
        Alert.alert("✅ Connexion réussie");
      }

      setTimeout(() => {
        setToken(token);
      }, 1000);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        "Connexion échouée";

      // Incrément des tentatives
      setLoginAttempts((prev) => prev + 1);

      triggerShakeAnimation();
      Alert.alert("❌ Connexion échouée", message);
    } finally {
      setIsLoading(false);
      animateButton(false);
    }
  };

  // Proposer l'activation de la biométrie
  const showBiometricSetupPrompt = (
    userEmail: string,
    userPassword: string
  ) => {
    const biometricName = getBiometricName();

    Alert.alert(
      "🔐 Sécurité biométrique",
      `Souhaitez-vous activer ${biometricName} pour vous connecter plus rapidement ?`,
      [
        { text: "Plus tard", style: "cancel" },
        {
          text: "Activer",
          onPress: () => saveBiometricCredentials(userEmail, userPassword),
        },
      ]
    );
  };

  // Sauvegarder les identifiants pour la biométrie
  const saveBiometricCredentials = async (
    userEmail: string,
    userPassword: string
  ) => {
    try {
      const credentials = {
        email: userEmail,
        password: userPassword,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(
        "biometric_credentials",
        JSON.stringify(credentials)
      );
      setBiometricState((prev) => ({ ...prev, hasStoredCredentials: true }));

      if (Platform.OS === "android") {
        ToastAndroid.show("🔐 Biométrie activée", ToastAndroid.SHORT);
      } else {
        Alert.alert(
          "🔐 Biométrie activée",
          "Vous pourrez désormais vous connecter avec votre empreinte."
        );
      }
    } catch (error) {
      console.error("Erreur sauvegarde biométrie:", error);
    }
  };

  const handleBiometricLogin = async () => {
    if (!biometricState.hasStoredCredentials) {
      Alert.alert(
        "❌ Aucun identifiant sauvegardé",
        "Connectez-vous d'abord avec vos identifiants."
      );
      return;
    }
    // 💥 Vibration douce au tap
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Connexion avec biométrie",
      fallbackLabel: "Mot de passe",
      cancelLabel: "Annuler",
      disableDeviceFallback: true,
    });

    if (result.success) {
      const storedCredentials = await AsyncStorage.getItem(
        "biometric_credentials"
      );

      if (storedCredentials) {
        const {
          email: storedEmail,
          password: storedPassword,
          timestamp,
        } = JSON.parse(storedCredentials);
        const isExpired = Date.now() - timestamp > 30 * 24 * 60 * 60 * 1000;

        if (isExpired) {
          Alert.alert("⏰ Identifiants expirés", "Veuillez vous reconnecter.");
          await AsyncStorage.removeItem("biometric_credentials");
          setBiometricState((prev) => ({
            ...prev,
            hasStoredCredentials: false,
          }));
          return;
        }

        setEmail(storedEmail);
        setMotDePasse(storedPassword);
        await performLogin(storedEmail, storedPassword);
      }
    } else if (result.error !== "user_cancel") {
      Alert.alert("❌ Échec", "Authentification biométrique échouée.");
    }
  };

  // Obtenir le nom de la biométrie
  const getBiometricName = (): string => {
    switch (biometricState.biometricType) {
      case "TouchID":
        return "Touch ID";
      case "FaceID":
        return "Face ID";
      case "Fingerprint":
        return "l'empreinte digitale";
      default:
        return "la biométrie";
    }
  };

  // Obtenir l'icône de biométrie
  const getBiometricIcon = (): string => {
    switch (biometricState.biometricType) {
      case "TouchID":
      case "Fingerprint":
        return "finger-print";
      case "FaceID":
        return "scan";
      default:
        return "shield-checkmark";
    }
  };

  // Désactiver la biométrie
  const disableBiometric = async () => {
    Alert.alert(
      "🔐 Désactiver la biométrie",
      "Êtes-vous sûr de vouloir désactiver la connexion biométrique ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Désactiver",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("biometric_credentials");
            setBiometricState((prev) => ({
              ...prev,
              hasStoredCredentials: false,
            }));

            if (Platform.OS === "android") {
              ToastAndroid.show("🔐 Biométrie désactivée", ToastAndroid.SHORT);
            } else {
              Alert.alert("🔐 Biométrie désactivée");
            }
          },
        },
      ]
    );
  };

  // Fonction pour obtenir la couleur de bordure selon l'état
  const getBorderColor = (field: keyof ValidationState) => {
    const state = validationState[field];
    if (errors[field]) return "#FF3B30";
    if (state === "valid") return "#34C759";
    if (state === "invalid") return "#FF3B30";
    return theme.border;
  };

  // Fonction pour obtenir l'icône de validation
  const getValidationIcon = (field: keyof ValidationState) => {
    const state = validationState[field];
    if (state === "validating") {
      return <ActivityIndicator size="small" color={theme.accent} />;
    }
    if (state === "valid") {
      return <Icon name="checkmark-circle" size={20} color="#34C759" />;
    }
    if (state === "invalid") {
      return <Icon name="close-circle" size={20} color="#FF3B30" />;
    }
    return null;
  };

  return (
    <ImageBackground
      source={theme.backgroundImage} // Ton image
      style={styles.background}
      resizeMode="cover" 
    >
    <KeyboardAvoidingView
      style={[styles.container]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.customThemeSwitchContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleTheme}
          style={[
            styles.customSwitch,
            { backgroundColor: themeType === "dark" ? "#183153" : "#73C0FC" },
          ]}
        >
          {/* Sun and Moon icons inside the switch */}
          <Icon
            name="moon"
            size={20}
            color="#73C0FC"
            style={{ position: "absolute", left: 6, top: 7, zIndex: 1 }}
          />
          <Icon
            name="sunny"
            size={20}
            color="#FFD700"
            style={{ position: "absolute", right: 6, top: 7, zIndex: 1 }}
          />

          {/* Sliding knob */}
          <Animated.View
            style={[
              styles.knob,
              {
                transform: [{ translateX: knobTranslate }],
              },
            ]}
          />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.formContainer,
          {
            transform: [{ translateX: shakeAnimation }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo.jpg")}
            style={styles.logoImage}
          />
          <Text style={[styles.logoText, { color: theme.text }]}>Tijari<Text style={{ color: theme.accent }}>Wise</Text></Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={emailInputRef}
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: getBorderColor("email"),
                  paddingRight: 45,
                },
              ]}
              placeholder="Email"
              placeholderTextColor={theme.mutedText}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              value={email}
              onChangeText={handleEmailChange}
              editable={!isLoading}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
            <View style={styles.validationIcon}>
              {getValidationIcon("email")}
            </View>
          </View>
          {errors.email && (
            <Animated.View
              style={[styles.errorContainer, { opacity: errorOpacity }]}
            >
              <Text style={[styles.errorText, { color: "#FF3B30" }]}>
                {errors.email}
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <View style={styles.passwordContainer}>
            <TextInput
              ref={passwordInputRef}
              style={[
                styles.passwordInput,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: getBorderColor("motDePasse"),
                },
              ]}
              placeholder="Mot de passe"
              placeholderTextColor={theme.mutedText}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              value={motDePasse}
              onChangeText={handlePasswordChange}
              editable={!isLoading}
              onSubmitEditing={handleLogin}
            />
            <View style={styles.passwordIcons}>
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Icon
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={theme.mutedText}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.validationIcon}>
              {getValidationIcon("motDePasse")}
            </View>
          </View>
          {errors.motDePasse && (
            <Animated.View
              style={[styles.errorContainer, { opacity: errorOpacity }]}
            >
              <Text style={[styles.errorText, { color: "#FF3B30" }]}>
                {errors.motDePasse}
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Login Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isLoading ? theme.mutedText : theme.accent,
                shadowColor: theme.cardShadow,
                opacity: isLoading ? 0.7 : 1,
              },
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            onPressIn={() => animateButton(true)}
            onPressOut={() => animateButton(false)}
          >
            {isLoading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator
                  size="small"
                  color="#fff"
                  style={styles.spinner}
                />
                <Text style={styles.buttonText}>Connexion...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Connexion</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={[styles.link, { color: theme.mutedText }]}>
            Mot de passe oublié ?
          </Text>
        </TouchableOpacity>
        {biometricState.isAvailable && biometricState.hasStoredCredentials && showBiometric && (
          <TouchableOpacity
            onPress={handleBiometricLogin}
            style={styles.fingerprintButton}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.fingerprintPulseCircle,
                {
                  transform: [{ scale: pulseAnimation }],
                },
              ]}
            >
              <Icon name="finger-print" size={34} color={theme.accent} />
            </Animated.View>
            <Text style={[styles.fingerprintText, { color: theme.accent }]}>
              Connexion biométrique
            </Text>
          </TouchableOpacity>
        )}

        {/* Login Attempts Warning */}
        {loginAttempts > 0 && (
          <View style={styles.warningContainer}>
            <Icon name="warning" size={16} color="#FF9500" />
            <Text style={[styles.warningText, { color: "#FF9500" }]}>
              Tentatives restantes: {3 - loginAttempts}
            </Text>
          </View>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  name: { fontWeight: "bold", color: "#e53935" },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 26,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    paddingRight: 80,
    fontSize: 16,
  },
  passwordIcons: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 12,
  },
  eyeIcon: {
    padding: 5,
    marginRight: 8,
  },
  validationIcon: {
    minWidth: 20,
    alignItems: "center",
  },
  errorContainer: {
    marginTop: 5,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 5,
    fontWeight: "500",
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  forgotPassword: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 14,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    padding: 10,
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    borderRadius: 8,
  },
  warningText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "500",
  },
  fingerprintButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },

  fingerprintIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    transform: [{ scale: 1 }],
  },

  fingerprintText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  fingerprintPulseCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(229, 57, 53, 0.15)", // cercle rouge doux
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  themeToggleFloating: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    right: 20,
    zIndex: 10,
    marginTop: 20,
  },

  themeToggleButton: {
    width: 60,
    height: 30,
    borderRadius: 30,
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
  },

  toggleIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  customThemeSwitchContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    right: 20,
    zIndex: 10,
    marginTop: 20,
  },
  customSwitch: {
    width: 64,
    height: 34,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    zIndex: 1,
  },

  knob: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#e8e8e8",
    bottom: 2,
    left: 2,
    zIndex: 2,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
