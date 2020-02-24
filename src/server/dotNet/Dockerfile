FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build 
WORKDIR /src

COPY ./*.sln ./NuGet.config  ./
COPY ./*/*.csproj ./
RUN for file in $(ls *.csproj); do mkdir -p ./${file%.*}/ && mv $file ./${file%.*}/; done
RUN dotnet restore
COPY . .
RUN dotnet publish --configuration=Release --runtime=linux-x64 --output=/app  

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS final  
WORKDIR /app
COPY --from=build /app .
COPY --from=build /src/configs ./configs