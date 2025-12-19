# Sync Server Endpoints

The sync server runs on `http://localhost:3001` (or alternative port if 3001 is busy).

## Available Endpoints

### 1. Health Check

**GET** `http://localhost:3001/health`

Returns server status:

```json
{ "status": "ok", "port": 3001 }
```

Use this to verify the server is running.

### 2. Sync Tokens (from Figma Plugin)

**POST** `http://localhost:3001/api/sync-tokens`

Receives variables from Figma plugin and updates token files.

**Request Body:**

```json
{
  "variables": {
    "indigo/600": "#4f46e5",
    "slate/50": "#f8fafc"
  },
  "fileKey": "rDLR9ZCB0Dq2AmRvxrifds",
  "nodeId": "1:110"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Tokens synced successfully",
  "tokens": {
    "colors": 2,
    "borderRadius": 3,
    "spacing": 0,
    "shadows": 0
  },
  "timestamp": "2025-01-17T..."
}
```

## Root Path

**GET** `http://localhost:3001/`

Returns: `{"error":"Not found"}`

This is **expected behavior** - the root path doesn't serve a page. Use `/health` to check server status.

## Testing the Server

### In Browser:

Visit: `http://localhost:3001/health`

Should show: `{"status":"ok","port":3001}`

### Using PowerShell:

```powershell
Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing
```

### Using the Figma Plugin:

1. Open plugin in Figma
2. Click "Sync Tokens"
3. Plugin sends POST request to `/api/sync-tokens`
4. Server updates token files
5. Plugin shows success message

## Troubleshooting

**Seeing `{"error":"Not found"}` on root path?**

- ✅ This is normal! The server doesn't serve a web page
- ✅ Use `/health` endpoint to verify server is running
- ✅ The Figma plugin uses `/api/sync-tokens` endpoint

**Server not responding?**

- Check if server is running: Look for "Local sync server running" in terminal
- Test health endpoint: `http://localhost:3001/health`
- Check if port changed: Server will show which port it's using
