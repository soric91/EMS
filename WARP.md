# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

EMS is an Energy Management System with a microservices architecture consisting of:

- **WebServer**: React frontend application built with Rsbuild and Tailwind CSS
- **gatewayEMS**: Python service for Modbus communication with energy monitoring devices  
- **gatewayApi**: FastAPI backend service for API endpoints
- **database_ems**: MongoDB database for data persistence

The system uses Docker Compose for orchestration and is designed to monitor and manage energy devices through Modbus serial communication.

## Common Development Commands

### Docker Operations
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f [service_name]

# Rebuild and restart a specific service
docker compose up -d --build [service_name]

# Stop all services  
docker compose down

# Remove all containers and volumes
docker compose down -v
```

### WebServer Development
```bash
cd WebServer

# Install dependencies
npm install

# Development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Python Services Development

#### gatewayEMS (Modbus Gateway)
```bash
cd gatewayEMS

# Install dependencies with uv
uv sync

# Run locally
uv run python main.py
```

#### gatewayApi (FastAPI Backend)
```bash
cd gatewayApi

# Install dependencies with uv
uv sync

# Run locally  
uv run python main.py
```

### Testing Individual Components
```bash
# Test specific service in container
docker compose exec [service_name] /bin/bash

# Check serial device access (for Modbus)
ls -la /dev/ttyUSB0
```

## Architecture Details

### Service Communication
- **WebServer** communicates with **gatewayApi** via HTTP requests
- **gatewayEMS** reads from Modbus devices via `/dev/ttyUSB0` serial port
- **gatewayApi** provides REST API endpoints for frontend
- All services share configuration through `Config/config.ini`
- MongoDB stores energy monitoring data

### Configuration Management
- Centralized config in `Config/config.ini` with sections for Modbus, Server, Database, and MQTT
- Environment variables defined in `.env` file (not tracked in git)  
- Each Python service uses a `ConfigManager` class for configuration access
- Docker volumes mount config files to containers

### Frontend Architecture  
- React app with React Router for navigation
- Global state management using React Context (`GlobalState.jsx`)
- API calls centralized in `src/api/` directory
- Component structure with shared `AppLayout` wrapper
- Main pages: Login, Dashboard, Settings, ConfigDevices, Devices, Logs

### Hardware Integration
- Serial communication over `/dev/ttyUSB0` for Modbus RTU protocol
- Container requires `dialout` group membership for serial access
- Modbus configuration: 9600 baud, no parity, 1 stop bit

## Required Environment Setup

### Environment Variables (.env)
The system requires these environment variables:
- `api_port`: Port for gatewayApi service
- `db_port`: MongoDB port  
- `port`: WebServer port
- `db_user`: MongoDB username
- `db_password`: MongoDB password  
- `db_name`: MongoDB database name

### Hardware Requirements
- USB-to-serial adapter connected as `/dev/ttyUSB0`
- User must be in `dialout` group for serial access

## Development Notes

- Python services use uv for dependency management
- WebServer uses npm with Rsbuild as the build tool
- All services configured for hot reloading in development
- Docker Compose handles service networking and dependencies
- Configuration changes require container restart
