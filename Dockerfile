FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS builder
WORKDIR /source

# COPY ALL FILES
COPY . .

# COMPILE
RUN dotnet publish Tetromini.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS runner
WORKDIR /app
COPY --from=builder /app .
ENTRYPOINT ["dotnet", "Tetromini.dll"]
