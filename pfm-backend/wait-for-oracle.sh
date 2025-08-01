#!/bin/sh

echo "⏳ Attente du démarrage d'Oracle..."

# Test TCP sur le port Oracle (1521)
until nc -z "$ORACLE_HOST" "$ORACLE_PORT"; do
  echo "🟡 Oracle non prêt sur $ORACLE_HOST:$ORACLE_PORT, attente..."
  sleep 5
done

echo "✅ Oracle est prêt, démarrage de l'application..."
sleep 10
exec "$@"
