package com.example.trabalhofinal.Adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.trabalhofinal.Models.Domain.Notificacoes;
import com.example.trabalhofinal.R;

import java.util.ArrayList;

public class RecycleViewAdapterNotificacoes extends RecyclerView.Adapter {

    private static final String TAG = "RecycleViewAdapterNotif";
    private ArrayList<Notificacoes> notificacoes = new ArrayList<>();

    public RecycleViewAdapterNotificacoes(ArrayList<Notificacoes> notificacoes) {
        this.notificacoes = notificacoes;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.recycleview_notificacoes,parent,false);
        RecyclerView.ViewHolder viewHolder_notificacoes = new RecycleViewAdapterNotificacoes.ViewHolder_Notificacoes(view);
        return viewHolder_notificacoes;
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        ((ViewHolder_Notificacoes) holder).data_notificacao.setText(notificacoes.get(position).getCreatedAt());
        ((ViewHolder_Notificacoes) holder).notificacao.setText(notificacoes.get(position).getCONTEUDO());
    }

    @Override
    public int getItemCount() {
        return notificacoes.size();
    }

    public class ViewHolder_Notificacoes extends RecyclerView.ViewHolder{

        TextView data_notificacao;
        TextView notificacao;


        public ViewHolder_Notificacoes(@NonNull View itemView) {

            super(itemView);
            data_notificacao = itemView.findViewById(R.id.Data_notificacao);
            notificacao = itemView.findViewById(R.id.notificacao);

        }
    }

}
