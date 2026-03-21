# 🚀 Deploy Cute Sell en Azure - Paso a Paso

## 📋 Requisitos Previos
- Cuenta Azure activa
- GitHub account
- CLI de Azure instalada (opcional)

## 🔧 Paso 1: Crear Repositorio GitHub

1. **Crear repositorio nuevo**
   ```bash
   # En GitHub: New Repository → "cutesell-plush-store"
   # No añadir README, .gitignore ni license
   ```

2. **Conectar repositorio local**
   ```bash
   git remote add origin https://github.com/TU_USERNAME/cutesell-plush-store.git
   git push -u origin main
   ```

## ☁️ Paso 2: Configurar Azure

### 2.1 Crear Resource Group
```bash
az group create \
  --name cutesell-rg \
  --location "East US"
```

### 2.2 Crear App Service Plan
```bash
az appservice plan create \
  --name cutesell-plan \
  --resource-group cutesell-rg \
  --sku B1 \
  --is-linux
```

### 2.3 Crear App Service
```bash
az webapp create \
  --resource-group cutesell-rg \
  --plan cutesell-plan \
  --name cutesell-app \
  --runtime "NODE|18-lts"
```

## 🔐 Paso 3: Configurar Variables de Entorno

### 3.1 En Azure Portal
```bash
# Configurar variables de entorno
az webapp config appsettings set \
  --resource-group cutesell-rg \
  --name cutesell-app \
  --settings \
    PORT=3000 \
    ADMIN_USER=cutesell \
    ADMIN_PASSWORD=cutesell2026 \
    NODE_ENV=production
```

### 3.2 Obtener Publish Profile
1. En Azure Portal → cutesell-app
2. "Deployment Center" → "Local Git"
3. Descargar "Publish Profile"
4. Guardar como `cutesell-publish-profile.xml`

## 🚀 Paso 4: Configurar GitHub Actions

### 4.1 Agregar Secretos en GitHub
1. Ir al repositorio GitHub
2. Settings → Secrets and variables → Actions
3. Agregar nuevo secret: `AZURE_WEBAPP_PUBLISH_PROFILE`
4. Pegar contenido del publish profile

### 4.2 Activar Workflows
- El workflow ya está configurado en `.github/workflows/azure-deploy.yml`
- Se activará automáticamente en cada push a main

## 📦 Paso 5: Deploy Automático

### 5.1 Push para Activar Deploy
```bash
git add .
git commit -m "🚀 Ready for Azure deployment"
git push origin main
```

### 5.2 Verificar Deploy
1. GitHub Actions → Ver workflow en ejecución
2. Azure Portal → cutesell-app → Deployment Center
3. Esperar finalización (2-3 minutos)

## 🌐 Paso 6: Verificar Aplicación

### 6.1 URLs de Acceso
- **Frontend**: `https://cutesell-app.azurewebsites.net`
- **API**: `https://cutesell-app.azurewebsites.net/api/*`
- **Admin**: `https://cutesell-app.azurewebsites.net/login`

### 6.2 Test de Funcionalidad
```bash
# Test API health
curl https://cutesell-app.azurewebsites.net/api/inventory/health

# Test frontend
# Visitar URL principal en navegador
```

## 🔧 Paso 7: Configuración Adicional

### 7.1 Dominio Personalizado (Opcional)
```bash
az webapp config hostname add \
  --webapp-name cutesell-app \
  --resource-group cutesell-rg \
  --hostname "cutesell.com"
```

### 7.2 SSL Certificate
```bash
az webapp config ssl bind \
  --webapp-name cutesell-app \
  --resource-group cutesell-rg \
  --hostname "cutesell.com" \
  --certificate-thumbprint "THUMBPRINT"
```

## 📊 Paso 8: Monitoreo

### 8.1 Application Insights
```bash
az monitor app-insights component create \
  --app cutesell-insights \
  --location "East US" \
  --application-type web \
  --resource-group cutesell-rg
```

### 8.2 Logs
```bash
# Ver logs en tiempo real
az webapp log tail \
  --resource-group cutesell-rg \
  --name cutesell-app
```

## 🎯 Estructura Final en Azure

```
cutesell-app/
├── backend/dist/        # API NestJS
├── frontend/out/        # Frontend estático
├── uploads/            # Imágenes de productos
└── web.config          # Configuración IIS
```

## 🚨 Troubleshooting

### Problemas Comunes

1. **Error 500 - Internal Server**
   ```bash
   # Revisar logs
   az webapp log tail --resource-group cutesell-rg --name cutesell-app
   ```

2. **Build fallido en GitHub Actions**
   - Verificar secretos configurados correctamente
   - Revisar sintaxis del workflow

3. **Variables de entorno no funcionan**
   ```bash
   # Verificar configuración
   az webapp config appsettings list --resource-group cutesell-rg --name cutesell-app
   ```

## 📱 Acceso a la Aplicación

- **URL Principal**: `https://cutesell-app.azurewebsites.net`
- **Login Admin**: `/login`
  - Usuario: `cutesell`
  - Contraseña: `cutesell2026`

## 🎉 ¡Listo!

Tu tienda Cute Sell está ahora desplegada en Azure y accesible globalmente.
