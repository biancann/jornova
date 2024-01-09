"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
    </g>
  );
};

export default function MoodMeter({ journals }) {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (journals.length === 0) return;

    let moods = {
      happy: 0,
      sad: 0,
      exited: 0,
      angry: 0,
      calm: 0,
      confused: 0,
      bored: 0,
      chill: 0,
      embrassed: 0,
      uncomfortable: 0,
      worried: 0,
    };

    journals.map((i) => {
      if (i.mood === "happy") {
        moods = { ...moods, happy: moods.happy + 1 };
      } else if (i.mood === "sad") {
        moods = { ...moods, sad: moods.sad + 1 };
      } else if (i.mood === "exited") {
        moods = { ...moods, exited: moods.exited + 1 };
      } else if (i.mood === "angry") {
        moods = { ...moods, angry: moods.angry + 1 };
      } else if (i.mood === "calm") {
        moods = { ...moods, calm: moods.calm + 1 };
      } else if (i.mood === "confused") {
        moods = { ...moods, confused: moods.confused + 1 };
      } else if (i.mood === "bored") {
        moods = { ...moods, bored: moods.bored + 1 };
      } else if (i.mood === "chill") {
        moods = { ...moods, chill: moods.chill + 1 };
      } else if (i.mood === "embrassed") {
        moods = { ...moods, embrassed: moods.embrassed + 1 };
      } else if (i.mood === "uncomfortable") {
        moods = { ...moods, uncomfortable: moods.uncomfortable + 1 };
      } else if (i.mood === "worried") {
        moods = { ...moods, worried: moods.worried + 1 };
      }
    });

    const theData = [];
    for (const m in moods) {
      theData.push({
        name: m,
        value: moods[m],
      });
    }
    setData(theData);
  }, [journals]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#6366f1"
          dataKey="value"
          onMouseEnter={onPieEnter}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
