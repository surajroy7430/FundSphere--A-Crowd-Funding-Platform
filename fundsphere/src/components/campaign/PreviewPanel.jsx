import React from "react";

const PreviewPanel = ({ watch }) => {
  const values = watch();

  const title = values.title || "Campaign title preview";
  const desc = values.description || "Campaign description preview...";
  const goal = values.goalAmount ? `₹${values.goalAmount}` : "Goal amount";
  const date = values.deadline
    ? values.deadline.toLocaleDateString()
    : "No deadline selected";

  const milestones = values.milestones || [];
  const media = values.media || [];

  const progressPercentage = 0;

  return (
    <div className="sticky top-6 space-y-4">
      <div className="bg-white rounded-lg p-4">
        <div className="h-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
          {media.length > 0 ? (
            <img
              src={media[media.length - 1]}
              alt="cover"
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.outerHTML = `
                    <video
                      src={media[media.length - 1]}
                      controls
                      className="object-cover w-full h-full"
                    ></video>`;
              }}
            />
          ) : (
            <div className="text-sm text-muted-foreground">Media preview</div>
          )}
        </div>

        <h3 className="mt-3 text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{desc}</p>

        <div className="mt-3">
          <div className="text-xs text-muted-foreground">Goal</div>
          <div className="font-medium">{goal}</div>
        </div>
        <div className="mt-3">
          <div className="text-xs text-muted-foreground">Deadline</div>
          <div className="font-medium">{date}</div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              style={{ width: `${progressPercentage}%` }}
              className="h-3 bg-green-500"
            />
          </div>
          <div className="text-xs mt-1">{progressPercentage}% funded</div>
        </div>

        <div className="mt-4">
          <div className="text-xs font-medium">Milestones</div>
          <ul className="list-disc list-inside text-sm">
            {milestones.length === 0 && (
              <li className="text-muted-foreground">No milestones yet</li>
            )}
            {milestones.map((m, i) => (
              <li key={i}>
                {m.percentage}% - {m.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
