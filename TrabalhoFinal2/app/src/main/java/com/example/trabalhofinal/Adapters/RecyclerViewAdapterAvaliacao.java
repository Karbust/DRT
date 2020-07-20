package com.example.trabalhofinal.Adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.trabalhofinal.Models.Domain.Avaliacao;
import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.SharedPrefManager;
import com.hsalf.smileyrating.SmileyRating;

import java.util.ArrayList;

public class RecyclerViewAdapterAvaliacao extends RecyclerView.Adapter {

    private static final String TAG = "RecyclerViewAdapterHistorico";
    private ArrayList<Avaliacao> avaliacaos = new ArrayList<>();
    private Context context;

    public RecyclerViewAdapterAvaliacao(ArrayList<Avaliacao> avaliacaos) {
        this.avaliacaos = avaliacaos;
    }


    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.recycleview_avaliacao, parent, false);
        RecyclerView.ViewHolder viewHolder_avaliacao = new RecyclerViewAdapterAvaliacao.ViewHolder_Avaliacao(view);
        return viewHolder_avaliacao;
    }

    @Override
    public int getItemCount() {
        return avaliacaos.size();
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if (holder instanceof RecyclerViewAdapterAvaliacao.ViewHolder_Avaliacao) {
            ((RecyclerViewAdapterAvaliacao.ViewHolder_Avaliacao) holder).rating.setRating(avaliacaos.get(position).getCLASSIFICACAO());
            if(avaliacaos.get(position).getCOMENTARIO() == null || avaliacaos.get(position).getCOMENTARIO().equals("")){
                ((RecyclerViewAdapterAvaliacao.ViewHolder_Avaliacao) holder).coment.setText("Sem Comentário");
            }else{
                ((RecyclerViewAdapterAvaliacao.ViewHolder_Avaliacao) holder).coment.setText(avaliacaos.get(position).getCOMENTARIO());
            }
        }
    }


    public class ViewHolder_Avaliacao extends RecyclerView.ViewHolder {

        RatingBar rating;
        TextView coment;

        public ViewHolder_Avaliacao(@NonNull View itemView) {

            super(itemView);
            rating = itemView.findViewById(R.id.smile_rating_rating);
            coment = itemView.findViewById(R.id.coment);

        }
    }
}
