package main

import (
	"encoding/json"
	"fmt"
	"time"
)

type NWJSWindowRPCServer struct{}

func (s *NWJSWindowRPCServer) Show(a *bool, b *bool) error {
	return ShowWindow()
}

type NWJSWindow struct {
	// Here there's gonna be some stuff!
}

type NWJSWindowCommand struct {
	Module string      `json:"module"`
	Method string      `json:"method"`
	Params interface{} `json:"params"`
}

func ShowWindow() error {
	cmd, err := json.Marshal(&NWJSWindowCommand{
		Module: "window",
		Method: "show",
	})
	if err != nil {
		return err
	}
	go func() {
		<-time.After(time.Second)
		fmt.Println("CMD:", string(cmd))
	}()
	return nil
}
