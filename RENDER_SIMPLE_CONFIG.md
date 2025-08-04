# Use this configuration in Render

## Service Settings:
- **Root Directory**: `` (leave empty)
- **Build Command**: `cd loginapp && ./mvnw clean package -DskipTests || mvn clean package -DskipTests`
- **Start Command**: `cd loginapp && java -jar target/*.jar`

## Environment Variables:
- `DATABASE_URL` = `postgresql://postgres:[salmaaN_20]@db.juulbplyppgklawlxwjd.supabase.co:5432/postgres`
- `SPRING_PROFILES_ACTIVE` = `render`
- `PORT` = `8080`
- `JAVA_TOOL_OPTIONS` = `-Xmx300m -Xss512k -XX:CICompilerCount=2`

## Alternative Build Command:
If the above doesn't work, try:
`cd loginapp && chmod +x mvnw && ./mvnw clean package -DskipTests`
