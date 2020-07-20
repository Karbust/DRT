package com.example.trabalhofinal.Adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.trabalhofinal.R;

import java.util.ArrayList;

public class RecyclerViewAdapterPassageiros extends RecyclerView.Adapter {

    private static final String TAG = "RecyclerViewAdapterPass";
    private ArrayList<String> nr_passageiros = new ArrayList<>();
    private Context context;

    public RecyclerViewAdapterPassageiros(ArrayList<String> nr_passageiros) {
        this.nr_passageiros = nr_passageiros;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.recycleview_passageiros,parent,false);
        RecyclerView.ViewHolder viewHolder_passageiros = new RecyclerViewAdapterPassageiros.ViewHolder_Passageiros(view );
        return viewHolder_passageiros;
    }

    public String getViagemByPosition(int position) {
        return nr_passageiros.get(position);
    }

    public void setNr_passageiros(ArrayList<String> nr_passageiros) {
        this.nr_passageiros = nr_passageiros;
    }


    @Override
    public int getItemCount() {
        return nr_passageiros.size();
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        ((ViewHolder_Passageiros) holder).nr_passageiro.setText(nr_passageiros.get(position));
    }


    public class ViewHolder_Passageiros extends RecyclerView.ViewHolder{

        EditText nr_passageiro;


        public ViewHolder_Passageiros(@NonNull View itemView) {

            super(itemView);
            nr_passageiro = itemView.findViewById(R.id.nr_passageiro);
        }
    }

}
