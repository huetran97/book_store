rm -rf ./dist
tsc
docker build -t registry.gitlab.com/huetran97/book-store/api .
docker push registry.gitlab.com/huetran97/book-store/api
