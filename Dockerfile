#FROM golang:onbuild
#EXPOSE 8080
FROM alpine:3.10
RUN apk add --update --no-cache vim git make musl-dev go curl
# Configure Go
RUN export GOPATH=/root/go
RUN export PATH=${GOPATH}/bin:/usr/local/go/bin:$PATH
RUN export GOBIN=$GOROOT/bin
RUN mkdir -p ${GOPATH}/src ${GOPATH}/bin
RUN export GO111MODULE=on
RUN go version

WORKDIR /app
COPY .   /app 


#RUN go get -d -v ./...
#RUN go install -v ./...

CMD ["go","run","src/Main.go"]