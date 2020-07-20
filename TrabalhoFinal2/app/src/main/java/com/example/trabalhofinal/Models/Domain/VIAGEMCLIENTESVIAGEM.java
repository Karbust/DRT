package com.example.trabalhofinal.Models.Domain;

import java.io.Serializable;
import java.util.ArrayList;

public class VIAGEMCLIENTESVIAGEM implements Serializable {

    private ClienteViagem ClienteViagem;

    public ClienteViagem getClienteViagem() {
        return ClienteViagem;
    }

    public void setClienteViagem(ClienteViagem clienteViagem) {
        ClienteViagem = clienteViagem;
    }

    public VIAGEMCLIENTESVIAGEM(ClienteViagem clienteViagem) {
        ClienteViagem = clienteViagem;
    }
}
