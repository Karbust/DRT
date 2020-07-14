package com.example.trabalhofinal.Utils;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;

import com.example.trabalhofinal.R;
import com.hsalf.smileyrating.SmileyRating;

public class GlobalUtils {

    public static void showDialog(Context context,DialogCallback dialogCallback){

        final int[] rating = {0};
        final String TAG = "GlobalUtils";

        final CostumDialog dialog = new CostumDialog(context, R.style.CustomDialogTheme);
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View v = inflater.inflate(R.layout.layout_dialog,null);

        dialog.setContentView(v);

        Button btn_done = dialog.findViewById(R.id.avaliar_dialog);
        SmileyRating smileyRating = dialog.findViewById(R.id.smile_rating);

        smileyRating.setSmileySelectedListener(new SmileyRating.OnSmileySelectedListener() {
            @Override
            public void onSmileySelected(SmileyRating.Type type) {
                // You can compare it with rating Type
                if (SmileyRating.Type.GREAT == type) {
                    Log.i(TAG, "Wow, the user gave high rating");
                }
                // You can get the user rating too
                // rating will between 1 to 5
                rating[0] = type.getRating();
            }
        });

        btn_done.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(dialogCallback != null)
                    dialogCallback.callback(rating[0]);
                dialog.dismiss();
            }
        });
        dialog.show();
    }

}
