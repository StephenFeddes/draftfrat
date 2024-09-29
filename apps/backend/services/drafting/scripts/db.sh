#!/bin/bash

# Run the psql command inside the PostgreSQL container
docker exec -it postgres-db psql -U postgres