FROM golang:1.14.9-alpine3.11
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN go build -o Main .
CMD ["/app/Main"]
#CMD ["go","run","/app/Main.go"]