package com.researcherapp.mobile;

import android.app.Activity;
import android.app.Fragment;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

public class MainActivity extends Activity {

    private LinearLayout navDashboard, navResearch, navSettings;
    private String userName = "Researcher";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        userName     = getIntent().getStringExtra("user_name");
        if (userName == null) userName = "Researcher";

        navDashboard = (LinearLayout) findViewById(R.id.navDashboard);
        navResearch  = (LinearLayout) findViewById(R.id.navResearch);
        navSettings  = (LinearLayout) findViewById(R.id.navSettings);

        navDashboard.setOnClickListener(v -> showTab(0));
        navResearch .setOnClickListener(v -> showTab(1));
        navSettings .setOnClickListener(v -> showTab(2));

        showTab(0);
    }

    private void showTab(int index) {
        updateNavColors(index);

        Fragment fragment;
        switch (index) {
            case 1:  fragment = new ResearchFragment();  break;
            case 2:  fragment = new SettingsFragment();  break;
            default: fragment = DashboardFragment.newInstance(userName, this::signOut); break;
        }

        getFragmentManager()
                .beginTransaction()
                .replace(R.id.content, fragment)
                .commit();
    }

    private void updateNavColors(int active) {
        int activeColor   = 0xFF1a237e;
        int inactiveColor = 0xFFbdbdbd;

        setNavColor(navDashboard, active == 0 ? activeColor : inactiveColor);
        setNavColor(navResearch,  active == 1 ? activeColor : inactiveColor);
        setNavColor(navSettings,  active == 2 ? activeColor : inactiveColor);
    }

    private void setNavColor(LinearLayout nav, int color) {
        for (int i = 0; i < nav.getChildCount(); i++) {
            View child = nav.getChildAt(i);
            if (child instanceof TextView) {
                ((TextView) child).setTextColor(color);
            }
        }
    }

    private void signOut() {
        startActivity(new Intent(this, LoginActivity.class));
        finish();
    }
}
