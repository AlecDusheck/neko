cd ../../
cd server
go get -v -t -d .
./build

cd ../
cd client
npm install
npm run build

cd ../
docker build -f ./.docker/files/simplyalec/Dockerfile -t simplyalec/neko:latest .