FROM microsoft/dotnet:2.0.0-sdk AS build 
WORKDIR /src

COPY ./*.sln ./NuGet.config  ./
COPY ./*/*.csproj ./
RUN for file in $(ls *.csproj); do mkdir -p ./${file%.*}/ && mv $file ./${file%.*}/; done
RUN dotnet restore
COPY . .
RUN dotnet publish --configuration=Release --runtime=linux-x64 --output=/app  

FROM microsoft/dotnet:2.0.0-sdk AS final  
WORKDIR /app
COPY --from=build /app .
COPY --from=build /src/configs ./configs