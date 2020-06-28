package com.example.trabalhofinal.Models.Responses;

import com.example.trabalhofinal.Models.Domain.User;

public class LoginResponse {
    private boolean success;
    private String message;
    private String token;
    private User data;

    public LoginResponse(boolean success, String message, String token, String nome, int tipo, String email, int telemovel,User data){
        this.success=success;
        this.message=message;
        this.token=token;
        this.data=data;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getToken(){return token;}

    public User getUser() {
        return data;
    }
}
