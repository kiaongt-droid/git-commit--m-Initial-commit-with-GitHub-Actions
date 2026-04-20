param(
  [int]$Port = 8080
)

$root = Get-Location
$mime = @{ 
  '.html' = 'text/html'
  '.htm' = 'text/html'
  '.css' = 'text/css'
  '.js' = 'application/javascript'
  '.json' = 'application/json'
  '.png' = 'image/png'
  '.jpg' = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.svg' = 'image/svg+xml'
  '.ico' = 'image/x-icon'
  '.txt' = 'text/plain'
  '.woff' = 'font/woff'
  '.woff2' = 'font/woff2'
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
$listener.Start()
Write-Host "Serving $root on http://0.0.0.0:$Port/"
Write-Host "Press Ctrl+C to stop."

while ($true) {
  try {
    $client = $listener.AcceptTcpClient()
    $stream = $client.GetStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $requestLine = $reader.ReadLine()
    if (-not $requestLine) {
      $client.Close()
      continue
    }

    $requestParts = $requestLine.Split(' ')
    $path = if ($requestParts.Length -ge 2) { $requestParts[1].TrimStart('/') } else { 'index.html' }
    if ([string]::IsNullOrWhiteSpace($path)) { $path = 'index.html' }
    $filePath = Join-Path $root $path

    if (-not (Test-Path $filePath)) {
      $responseText = "404 Not Found"
      $responseBytes = [System.Text.Encoding]::UTF8.GetBytes($responseText)
      $headers = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($responseBytes.Length)`r`nConnection: close`r`n`r`n"
      $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
      $stream.Write($headerBytes, 0, $headerBytes.Length)
      $stream.Write($responseBytes, 0, $responseBytes.Length)
      $client.Close()
      continue
    }

    $ext = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
    $contentType = $mime[$ext]
    if (-not $contentType) { $contentType = 'application/octet-stream' }
    $body = [System.IO.File]::ReadAllBytes($filePath)

    $headers = "HTTP/1.1 200 OK`r`nContent-Type: $contentType; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
    $stream.Write($headerBytes, 0, $headerBytes.Length)
    $stream.Write($body, 0, $body.Length)
    $client.Close()
  } catch {
    Write-Host "Server error: $_"
  }
}
