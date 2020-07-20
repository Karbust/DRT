package com.example.trabalhofinal.Adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.trabalhofinal.Models.Domain.ClienteViagem;
import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.Models.Domain.ViagensMotorista;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.util.ArrayList;

public class RecyclerViewAdapterCheckPassageiros extends RecyclerView.Adapter{

    public interface OnFaltouListener{
        void OnFaltouListener(int position);
    }

    public interface OnPagouListener{
        void OnPagouListener(int position);
    }

    public interface OnPresentListener{
        void OnPresentListener(int position);
    }

    private static final String TAG = "RecyclerViewAdapterHistorico";
    private ViagensMotorista clienteViagems;
    private Context context;
    RecyclerViewAdapterCheckPassageiros.OnFaltouListener onFaltouListener;
    RecyclerViewAdapterCheckPassageiros.OnPagouListener onPagouListener;
    RecyclerViewAdapterCheckPassageiros.OnPresentListener onPresentListener;
    SharedPrefManager sharedPrefManager;

    public RecyclerViewAdapterCheckPassageiros( RecyclerViewAdapterCheckPassageiros.OnFaltouListener onFaltouListener,RecyclerViewAdapterCheckPassageiros.OnPagouListener onPagouListener,RecyclerViewAdapterCheckPassageiros.OnPresentListener onPresentListener,Context context) {
        this.onFaltouListener = onFaltouListener;
        this.onPagouListener = onPagouListener;
        this.onPresentListener = onPresentListener;
        this.context = context;
        sharedPrefManager = SharedPrefManager.getInstance(context);
    }

    public ViagensMotorista getClienteViagems() {
        return clienteViagems;
    }

    public void setClienteViagems(ViagensMotorista clienteViagems) {
        this.clienteViagems = clienteViagems;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.recyclerview_checkpassageiros,parent,false);
        RecyclerView.ViewHolder viewHolder_passageirosCheck = new RecyclerViewAdapterCheckPassageiros.ViewHolder_PassageirosCheck(view ,onFaltouListener,onPagouListener,onPresentListener);
        return viewHolder_passageirosCheck;
    }

    @Override
    public int getItemCount() {
        return clienteViagems.getViagemclientesviagem().size();
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if(holder instanceof RecyclerViewAdapterCheckPassageiros.ViewHolder_PassageirosCheck){
            ((ViewHolder_PassageirosCheck) holder).nome.setText(clienteViagems.getViagemclientesviagem().get(position).getClienteViagem().getNOME_UTILIZADOR());
        }
    }


    public class ViewHolder_PassageirosCheck extends RecyclerView.ViewHolder{

        TextView nome;
        Button pago;
        Button faltou;
        Button presente;
        RecyclerViewAdapterCheckPassageiros.OnFaltouListener onFaltouListener;
        RecyclerViewAdapterCheckPassageiros.OnPagouListener onPagouListener;
        RecyclerViewAdapterCheckPassageiros.OnPresentListener onPresentListener;

        public ViewHolder_PassageirosCheck(@NonNull View itemView, RecyclerViewAdapterCheckPassageiros.OnFaltouListener onFaltouListener, RecyclerViewAdapterCheckPassageiros.OnPagouListener onPagouListener,RecyclerViewAdapterCheckPassageiros.OnPresentListener onPresentListener) {

            super(itemView);
            this.onFaltouListener = onFaltouListener;
            this.onPagouListener = onPagouListener;
            this.onPresentListener = onPresentListener;
            nome = itemView.findViewById(R.id.nome_passageiro);
            faltou = itemView.findViewById(R.id.falta);
            pago = itemView.findViewById(R.id.pagou);
            presente = itemView.findViewById(R.id.presente);

            View.OnClickListener FaltouClick = new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    onFaltouListener.OnFaltouListener(getAdapterPosition());
                }
            };
            faltou.setOnClickListener(FaltouClick);

            View.OnClickListener PagouClick = new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    onPagouListener.OnPagouListener(getAdapterPosition());
                }
            };
            pago.setOnClickListener(PagouClick);

            View.OnClickListener PresenteClick = new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    onPresentListener.OnPresentListener(getAdapterPosition());
                }
            };
            presente.setOnClickListener(PresenteClick);
        }
    }

}
