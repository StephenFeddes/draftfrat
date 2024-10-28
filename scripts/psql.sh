#!/bin/bash
# Usage: ./script.sh <database_name>

DATABASE=$1

docker exec -it postgresdb psql -U user1 -d $DATABASE