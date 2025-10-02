# ⚽ SoccerManager - Sistema de Gestión de Fútbol

Un sistema completo de gestión de fútbol desarrollado como prueba técnica para Postobón, que permite administrar equipos, partidos, goles y visualizar la tabla de posiciones de un torneo.

## 📋 Descripción del Proyecto

SoccerManager es una aplicación web full-stack que simula un sistema de gestión de torneos de fútbol. Permite crear equipos, programar partidos, registrar resultados y goles, y mantener automáticamente una tabla de posiciones actualizada.

### 🎯 Características Principales

- ✅ **Gestión de Equipos**: Crear, editar y administrar equipos participantes
- ✅ **Gestión de Partidos**: Programar partidos y registrar resultados
- ✅ **Registro de Goles**: Detalle completo de goles con minuto, jugador y equipo
- ✅ **Tabla de Posiciones**: Cálculo automático de posiciones, puntos, partidos jugados, ganados, empatados y perdidos
- ✅ **Interfaz Moderna**: UI/UX atractiva y responsive con Angular Material
- ✅ **API RESTful**: Backend robusto con documentación Swagger

## 🏗️ Arquitectura del Sistema

### Backend (.NET 8 / C#)

```
soccer-manager-backend/
├── Controllers/          # Controladores de API
│   ├── TeamsController.cs
│   ├── MatchesController.cs
│   └── StandingsController.cs
├── Models/              # Modelos de datos
│   ├── Team.cs
│   ├── Match.cs
│   └── Goal.cs
├── DTOs/               # Data Transfer Objects
├── Data/               # Contexto de Entity Framework
├── Services/           # Lógica de negocio
└── tests/             # Pruebas unitarias
```

### Frontend (Angular 19)

```
soccer-manager-frontend/
├── src/app/
│   ├── core/           # Servicios y modelos compartidos
│   ├── features/       # Módulos por funcionalidad
│   │   ├── teams/      # Gestión de equipos
│   │   ├── matches/    # Gestión de partidos
│   │   └── standings/  # Tabla de posiciones
│   └── shared/         # Componentes compartidos
```

## 🛠️ Tecnologías Utilizadas

### Backend

- **Framework**: .NET 8 / ASP.NET Core Web API
- **ORM**: Entity Framework Core 9.0.9
- **Base de Datos**: SQL Server
- **Documentación**: Swagger/OpenAPI
- **Mapeo**: AutoMapper 12.0.1
- **Testing**: MSTest

### Frontend

- **Framework**: Angular 19.2
- **UI Library**: Angular Material 19.2
- **Estilos**: SCSS
- **HTTP Client**: Angular HttpClient
- **Testing**: Jasmine + Karma

### Base de Datos

- **Motor**: SQL Server
- **Tablas Principales**:
  - `TBL_Team`: Información de equipos
  - `TBL_Match`: Partidos y resultados
  - `TBL_Goal`: Registro detallado de goles

## 🚀 Instalación y Configuración

### Prerrequisitos

- .NET 8 SDK
- Node.js 18+ y npm
- SQL Server (LocalDB o instancia completa)
- Angular CLI 19+

### 1. Configuración de la Base de Datos

```sql
-- Ejecutar el script de base de datos
sqlcmd -S (localdb)\MSSQLLocalDB -i Scripts_DB.sql
```

### 2. Configuración del Backend

```bash
cd soccer-manager-backend/SoccerManager

# Restaurar paquetes NuGet
dotnet restore

# Configurar la cadena de conexión en appsettings.json
# Ejecutar las migraciones (si aplica)
dotnet ef database update

# Ejecutar el proyecto
dotnet run
```

El backend estará disponible en: `https://localhost:7289`

### 3. Configuración del Frontend

```bash
cd soccer-manager-frontend

# Instalar dependencias
npm install

# Ejecutar el servidor de desarrollo
ng serve
```

El frontend estará disponible en: `http://localhost:4200`

## 📚 API Endpoints

### Teams (Equipos)

- `GET /api/teams` - Listar todos los equipos activos
- `GET /api/teams/{id}` - Obtener equipo por ID
- `POST /api/teams` - Crear nuevo equipo
- `PUT /api/teams/{id}` - Actualizar equipo
- `DELETE /api/teams/{id}` - Desactivar equipo

### Matches (Partidos)

- `GET /api/matches` - Listar todos los partidos
- `GET /api/matches/{id}` - Obtener partido por ID con goles
- `POST /api/matches` - Crear nuevo partido
- `PUT /api/matches/{id}` - Actualizar resultado del partido

### Standings (Posiciones)

- `GET /api/standings` - Obtener tabla de posiciones actualizada

## 🎨 Características de la UI

### Tabla de Posiciones

- **Visualización jerárquica**: Las primeras 8 posiciones destacadas en azul
- **Información completa**: PJ, PG, PE, PP, GF, GC, DG, PTS
- **Responsive design**: Adaptable a diferentes tamaños de pantalla

### Detalle de Partidos

- **Vista atractiva de goles**: Tabla con efectos visuales y emojis temáticos
- **Información completa**: Minuto, equipo y goleador
- **Estados del partido**: Programado, jugado, finalizado

### Gestión de Equipos

- **Formularios intuitivos**: Creación y edición simplificada
- **Validaciones**: Campos requeridos y formatos correctos

## 🧪 Testing

### Backend

```bash
cd soccer-manager-backend/tests
dotnet test
```

### Frontend

```bash
cd soccer-manager-frontend
ng test
```

## 📊 Base de Datos - Modelo

### Esquema Principal

- **TBL_Team**: Equipos participantes
- **TBL_Match**: Partidos del torneo
- **TBL_Goal**: Goles registrados por partido

### Relaciones

- Un partido tiene dos equipos (local y visitante)
- Un partido puede tener múltiples goles
- Cada gol pertenece a un equipo y un partido específico

## 🔧 Configuración Adicional

### CORS (Backend)

El backend está configurado para permitir requests desde `http://localhost:4200` durante el desarrollo.

### Environment Variables (Frontend)

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7289/api',
};
```

## 📈 Funcionalidades Futuras

- [ ] Autenticación y autorización de usuarios
- [ ] Estadísticas avanzadas de jugadores
- [ ] Gestión de múltiples torneos
- [ ] Notificaciones en tiempo real
- [ ] Exportación de reportes en PDF/Excel
- [ ] Dashboard administrativo avanzado

## 👨‍💻 Desarrollador

**Fredy** - Desarrollador Full Stack

- GitHub: [@Fredy034](https://github.com/Fredy034)

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica.
