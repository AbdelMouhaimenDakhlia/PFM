export const darkTheme = {
  mode: 'dark',
  background: '#1B1B1B',          // Fond général sombre
  backgroundImage: require('../assets/bg-d.png'), // Image pour le thème sombre
  card: '#333333',                // Cartes & éléments de liste (plus clair)
  text: '#EAEAEA',                // Texte principal (plus clair pour ressortir sur fond sombre)
  border: '#444444',              // Bordures discrètes (plus visibles)
  accent: '#FF9A00',              // Orange plus lumineux pour plus de visibilité
  mutedText: '#BBBBBB',           // Texte secondaire
  primary: '#D62027',             // Rouge vif (actions, boutons)
  header: '#292929',              // Header plus clair
  navBackground: '#1B1B1B',       // Bottom tab
  navIcon: '#FF9A00',             // Icônes actifs (accent)
  navInactive: '#888888',         // Icônes inactifs
  chartPrimary: '#FF9A00',        // Courbes, barres (orange clair)
  chartSecondary: '#D62027',      // Courbes secondaires
  cardShadow: '#00000080',        // Ombres subtiles
};

export const lightTheme = {
  mode: 'light',
  background: '#FFF9E0',          // Fond général plus clair pour ressortir mieux sur l'image
  backgroundImage: require('../assets/bg.png'), // Image pour le thème clair
  card: '#FFFFFF',                // Cartes et liste
  text: '#212121',                // Texte principal plus sombre
  border: '#E0E0E0',              // Bordures
  accent: '#FF9A00',             // Orange vif (plus visible sur fond clair)
  mutedText: '#757575',           // Texte secondaire
  primary: '#D62027',             // Rouge vif (boutons)
  header: '#FFF9E0',              // Fond header clair
  navBackground: '#FFFFFF',       // Bottom tab  FF5722
  navIcon: '#D62027',             // Icône actif
  navInactive: '#999999',         // Icônes inactifs
  chartPrimary: '#FF9A00',        // Graphiques (courbes)
  chartSecondary: '#D62027',      // Barres secondaires
  cardShadow: '#0000001A',        // Ombres légères
};





/*export const darkTheme = {
  mode: 'dark',
  background: '#121212',       // Noir doux (meilleur que #060010 pour lisibilité)
  card: '#1E1A26',             // Violet foncé pour rappeler leur branding sobre
  text: '#FFFFFF',             // Blanc pour le texte principal
  border: '#2A213C',           // Plus doux que #271E37
  accent: '#e53935',           // Jaune doré (accent secondaire Attijari)
  mutedText: '#BDBDBD',        // Gris clair pour texte secondaire
  primary: '#E53935',          // Rouge vif (couleur principale)
};

export const lightTheme = {
  mode: 'light',
  background: '#FAFAFA',       // Blanc cassé (plus doux que #FFFFFF)
  card: '#FFFFFF',             // Carte en blanc
  text: '#212121',             // Noir gris foncé, plus lisible que #000
  border: '#E0E0E0',           // Gris clair
  accent: '#e53935',           // Jaune doré
  mutedText: '#757575',        // Gris foncé pour texte secondaire
  primary: '#E53935',          // Rouge vif
};*/
