package com.researcherapp.mobile;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class LoginActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        EditText etEmail    = (EditText) findViewById(R.id.etEmail);
        EditText etPassword = (EditText) findViewById(R.id.etPassword);
        Button   btnSignIn  = (Button)   findViewById(R.id.btnSignIn);

        btnSignIn.setOnClickListener(v -> {
            String email    = etEmail.getText().toString().trim();
            String password = etPassword.getText().toString().trim();

            if (TextUtils.isEmpty(email) || TextUtils.isEmpty(password)) {
                Toast.makeText(this, "Please enter your email and password.", Toast.LENGTH_SHORT).show();
                return;
            }

            String userName = email.contains("@") ? email.split("@")[0] : email;
            Intent intent   = new Intent(LoginActivity.this, MainActivity.class);
            intent.putExtra("user_name", userName);
            startActivity(intent);
            finish();
        });
    }
}
