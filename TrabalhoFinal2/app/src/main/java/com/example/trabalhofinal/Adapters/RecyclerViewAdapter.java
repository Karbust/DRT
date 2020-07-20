package com.example.trabalhofinal.Adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.example.trabalhofinal.Activities.Viagens;
import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.R;

import java.util.ArrayList;

public class RecyclerViewAdapter extends RecyclerView.Adapter {

    public interface OnDetalhesListener {
        void OnDetalhesClick(int position);
    }

    private static final String TAG = "RecyclerViewAdapter";
    private ArrayList<Viagem> viagens = new ArrayList<>();
    private Context context;
    OnDetalhesListener onDetalhesListener;

    public RecyclerViewAdapter(OnDetalhesListener onDetalhesListener) {
        this.onDetalhesListener = onDetalhesListener;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.recycleview_viagens,parent,false);
        RecyclerView.ViewHolder viewHolder = new ViewHolder(view , onDetalhesListener);
        return viewHolder;
    }

    public void setViagens(ArrayList<Viagem> viagens) {
        this.viagens = viagens;
    }

    public Viagem getViagemByPosition(int position) {
        return viagens.get(position);
    }

    @Override
    public int getItemCount() {
        return viagens.size();
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if(holder instanceof ViewHolder){
            ((ViewHolder) holder).origem.setText(viagens.get(position).getNrViagem().getOrigem().getLOCALIDADE());
            ((ViewHolder) holder).destino.setText(viagens.get(position).getNrViagem().getDestino().getLOCALIDADE());
            ((ViewHolder) holder).data.setText(viagens.get(position).getNrViagem().getDATAHORA_IDA());
        }
    }


    public class ViewHolder extends RecyclerView.ViewHolder{

        TextView data;
        TextView origem;
        TextView destino;
        Button detalhes;
        OnDetalhesListener onDetalhesListener;


        public ViewHolder(@NonNull View itemView, OnDetalhesListener onDetalhesListener) {

            super(itemView);
            this.onDetalhesListener = onDetalhesListener;
            data = itemView.findViewById(R.id.data_recycle);
            origem = itemView.findViewById(R.id.calde);
            destino = itemView.findViewById(R.id.hospital);
            detalhes = itemView.findViewById(R.id.detalhes);


            View.OnClickListener detalhesClick = new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    onDetalhesListener.OnDetalhesClick(getAdapterPosition());
                }
            };
            detalhes.setOnClickListener(detalhesClick);
        }
    }
}



