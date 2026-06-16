package com.researcherapp.mobile;

import android.content.Context;
import android.content.res.ColorStateList;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ProgressBar;
import android.widget.TextView;

import java.util.List;

public class ResearchAdapter extends ArrayAdapter<ResearchItem> {

    private static final int COLOR_ACTIVE    = 0xFF4caf50;
    private static final int COLOR_COMPLETED = 0xFF1a237e;
    private static final int COLOR_PENDING   = 0xFFff9800;
    private static final int COLOR_ARCHIVED  = 0xFFbdbdbd;

    public ResearchAdapter(Context context, List<ResearchItem> items) {
        super(context, 0, items);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            convertView = LayoutInflater.from(getContext())
                    .inflate(R.layout.item_research, parent, false);
        }

        ResearchItem item = getItem(position);
        if (item == null) return convertView;

        int statusColor = statusColor(item.status);

        ((TextView) convertView.findViewById(R.id.tvStatus)).setText(item.status.toUpperCase());
        ((TextView) convertView.findViewById(R.id.tvStatus)).setTextColor(statusColor);
        ((TextView) convertView.findViewById(R.id.tvCategory)).setText(item.category);
        ((TextView) convertView.findViewById(R.id.tvTitle)).setText(item.title);
        ((TextView) convertView.findViewById(R.id.tvDescription)).setText(item.description);
        ((TextView) convertView.findViewById(R.id.tvProgress)).setText(item.progress + "%");
        ((TextView) convertView.findViewById(R.id.tvDate)).setText("Updated " + item.updatedAt);

        ProgressBar pb = (ProgressBar) convertView.findViewById(R.id.progressBar);
        pb.setProgress(item.progress);
        pb.setProgressTintList(ColorStateList.valueOf(statusColor));

        return convertView;
    }

    private int statusColor(String status) {
        switch (status) {
            case "active":    return COLOR_ACTIVE;
            case "completed": return COLOR_COMPLETED;
            case "pending":   return COLOR_PENDING;
            default:          return COLOR_ARCHIVED;
        }
    }
}
