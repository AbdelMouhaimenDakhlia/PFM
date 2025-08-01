import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

export default function EditProfileScreen() {
  const [nom, setNom] = useState('');
  const [originalNom, setOriginalNom] = useState('');
  const [email, setEmail] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [originalImageUri, setOriginalImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { theme } = useAppTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/utilisateurs/me');
        setNom(res.data.nom);
        setOriginalNom(res.data.nom);
        setEmail(res.data.email);

        const savedUri = await AsyncStorage.getItem('profileImage');
        setImageUri(savedUri);
        setOriginalImageUri(savedUri);
      } catch (err) {
        Alert.alert('Erreur', 'Impossible de récupérer les informations');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission refusée', 'Accès à la galerie requis.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
      }
    } catch (error) {
      Alert.alert('Erreur', "Erreur lors de la sélection de l'image.");
    }
  };

  const resetImage = async () => {
    setImageUri(null);
  };

  const handleSubmit = async () => {
  const nomModifie = nom !== originalNom;
  const imageModifiee = imageUri !== originalImageUri;

  // Si aucune modification n'a été détectée, afficher une alerte
  if (!nomModifie && !imageModifiee) {
    Alert.alert('Aucune modification', 'Aucune modification détectée.');
    navigation.goBack();
    return;
  }

  try {
    // Si le nom a été modifié, envoyer la requête PUT à l'API
    if (nomModifie) {
      await api.put('/api/utilisateurs/me', { nom, email }); // Envoi de la requête PUT
      setOriginalNom(nom); // Mettre à jour l'originalNom après modification
    }

    // Si l'image a été modifiée, la gérer ici
    if (imageModifiee) {
      if (imageUri) {
        await AsyncStorage.setItem('profileImage', imageUri);
      } else {
        await AsyncStorage.removeItem('profileImage');
      }
      setOriginalImageUri(imageUri); // Mettre à jour l'originalImageUri
    }

    // Si tout a été mis à jour avec succès, afficher une alerte
    Alert.alert('Succès', 'Profil mis à jour');
    navigation.goBack();
  } catch (error: any) {
    console.error('Erreur update profil :', error?.response?.data || error.message);
    Alert.alert('Erreur', 'Échec de la mise à jour');
  }
};


  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={theme.primary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.mutedText, fontSize: 12 }}>Choisir une photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {imageUri && (
        <TouchableOpacity onPress={resetImage}>
          <Text style={[styles.resetText, { color: theme.accent }]}>Réinitialiser la photo</Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.label, { color: theme.text }]}>Nom</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        value={nom}
        editable={true}
        onChangeText={setNom}
        placeholder="Votre nom"
        placeholderTextColor={theme.mutedText}
      />

      <Text style={[styles.label, { color: theme.text }]}>Email</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        value={email}
        editable={false}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.accent }]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    marginTop: 20,
  },
  imagePicker: {
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    marginTop: 30,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
