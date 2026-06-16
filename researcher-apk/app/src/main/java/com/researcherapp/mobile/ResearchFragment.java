package com.researcherapp.mobile;

import android.app.Fragment;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ResearchFragment extends Fragment {

    private ResearchAdapter    adapter;
    private List<ResearchItem> allItems;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_research, container, false);

        allItems = new ArrayList<>(Arrays.asList(ResearchItem.mockData()));
        adapter  = new ResearchAdapter(getActivity(), new ArrayList<>(allItems));

        ListView listView = (ListView) view.findViewById(R.id.listResearch);
        listView.setAdapter(adapter);
        listView.setOnItemClickListener((parent, v, position, id) -> {
            ResearchItem item = adapter.getItem(position);
            if (item != null) {
                Toast.makeText(getActivity(),
                        item.title + "\n" + item.progress + "% complete",
                        Toast.LENGTH_LONG).show();
            }
        });

        EditText etSearch = (EditText) view.findViewById(R.id.etSearch);
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int a, int b, int c) {}
            @Override public void onTextChanged(CharSequence s, int a, int b, int c) { filter(s.toString()); }
            @Override public void afterTextChanged(Editable s) {}
        });

        return view;
    }

    private void filter(String query) {
        adapter.clear();
        for (ResearchItem item : allItems) {
            if (query.isEmpty() ||
                    item.title.toLowerCase().contains(query.toLowerCase()) ||
                    item.category.toLowerCase().contains(query.toLowerCase())) {
                adapter.add(item);
            }
        }
        adapter.notifyDataSetChanged();
    }
}
