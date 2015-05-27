package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/rpc"
	"net/rpc/jsonrpc"
	"os"
)

var ()

func main() {
	fmt.Println("All systems online.")

	rpcTest := new(TestServer)
	server := rpc.NewServer()
	server.RegisterName("Test", rpcTest)

	rwc := &StdRWC{
		in:  os.Stdin,
		out: os.Stdout,
	}

	jsonCodec := jsonrpc.NewServerCodec(rwc)
	server.ServeCodec(jsonCodec)
}

func testHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(os.Environ())
}

type StdRWC struct {
	in  io.Reader
	out io.Writer
}

func (rwc *StdRWC) Read(p []byte) (int, error) {
	return rwc.in.Read(p)
}

func (rwc *StdRWC) Write(p []byte) (int, error) {
	return rwc.out.Write(p)
}

func (rwc *StdRWC) Close() error {
	return nil
}

type TestArgs struct {
	Data string
}
type TestResp struct {
	Data string
}
type TestServer struct{}

func (s *TestServer) Echo(args *TestArgs, resp *TestResp) error {
	if args.Data == "" {
		return errors.New("I won't echo an empty string!")
	}
	resp.Data = fmt.Sprintf("Echoing: %s", args.Data)
	return nil
}
