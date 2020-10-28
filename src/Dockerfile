FROM golang:1.14.9-alpine3.11
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN apk add git
RUN go get -u github.com/gorilla/mux
RUN go build -o Main .
#CMD ["/app/Main"]
CMD ["go","run","/app/Main.go"]