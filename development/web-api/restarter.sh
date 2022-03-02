#echo "ចាប់ផ្តើមជាថ្មី"
 clear
 sudo lsof -n -i:8081 | grep LISTEN | awk '{ print $2 }' | uniq | xargs kill -9
 sudo rm -rf /dist 
 sudo npm run build && npm start

### widow
#FOR /F "tokens=7 delims= " %%P IN ('netstat -a -n -o ^| findstr :8081.*LISTENING') DO TaskKill.exe /PID %%P
#npm run build && npm start

# echo"សូមបង្ហាញស្នាមញញឹមរបស់អ្នកមក ហាសហាស"