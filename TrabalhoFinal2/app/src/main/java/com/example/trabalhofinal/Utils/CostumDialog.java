package com.example.trabalhofinal.Utils;

import android.app.Dialog;
import android.content.Context;

import androidx.annotation.NonNull;

public class CostumDialog extends Dialog {
    public CostumDialog(@NonNull Context context) {
        super(context);
        this.setCancelable(false);
    }

    public CostumDialog(@NonNull Context context, int themeResId) {
        super(context, themeResId);
        this.setCancelable(false);
    }

    @Override
    public void onBackPressed() {
        this.dismiss();
    }
}
