package com.researcherapp.mobile;

import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

public class SettingsFragment extends Fragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_settings, container, false);

        Button btnTest = (Button) view.findViewById(R.id.btnTestConnection);
        btnTest.setOnClickListener(v ->
            Toast.makeText(getActivity(),
                "Demo mode — configure a real API endpoint to connect.", Toast.LENGTH_LONG).show()
        );

        return view;
    }
}
