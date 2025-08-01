# Étape de build Maven
FROM openjdk:17-jdk-alpine AS build

WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Étape d'exécution
FROM openjdk:17-jdk-alpine

# Définir les variables d'environnement Oracle (optionnel)
ENV ORACLE_HOST=oracle
ENV ORACLE_PORT=1521

# Ajout du fichier jar depuis le build
ARG JAR_FILE=/workspace/app/target/*.jar
COPY --from=build ${JAR_FILE} backend.jar

# Copie du script wait-for-oracle
COPY wait-for-oracle.sh /wait-for-oracle.sh
RUN chmod +x /wait-for-oracle.sh

# Créer le répertoire /data et copier le fichier CSV
RUN mkdir -p /data
COPY resources/transactions11.csv /data/transactions11.csv

EXPOSE 8081

# Utilise le script comme point d'entrée
ENTRYPOINT ["/wait-for-oracle.sh", "java", "-jar", "/backend.jar"]
