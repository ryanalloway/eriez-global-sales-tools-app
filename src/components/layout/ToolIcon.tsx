import DashboardOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

export function ToolIcon({ id }: { id: string }) {
  switch (id) {
    case "manual":
      return <ShowChartOutlinedIcon fontSize="small" />;
    case "profiles":
      return <LayersOutlinedIcon fontSize="small" />;
    case "contours":
      return <GridViewOutlinedIcon fontSize="small" />;
    case "help":
      return <HelpOutlineOutlinedIcon fontSize="small" />;
    default:
      return <DashboardOutlinedIcon fontSize="small" />;
  }
}