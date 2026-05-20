# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM alpine:3.19 AS assets
WORKDIR /dist
COPY --from=builder /app/dist .
# Files are copied into the shared volume at container start (see docker-compose.yml).
