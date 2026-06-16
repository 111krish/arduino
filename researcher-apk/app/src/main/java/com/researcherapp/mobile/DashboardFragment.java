package com.researcherapp.mobile;

import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

public class DashboardFragment extends Fragment {

    private String   userName;
    private Runnable onSignOut;

    public static DashboardFragment newInstance(String userName, Runnable onSignOut) {
        DashboardFragment f = new DashboardFragment();
        f.userName  = userName;
        f.onSignOut = onSignOut;
        return f;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_dashboard, container, false);

        TextView tvUserName = (TextView) view.findViewById(R.id.tvUserName);
        Button   btnSignOut = (Button)   view.findViewById(R.id.btnSignOut);

        if (userName != null) tvUserName.setText(userName);

        btnSignOut.setOnClickListener(v -> {
            if (onSignOut != null) onSignOut.run();
        });

        return view;
    }
}
