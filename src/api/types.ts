export interface Photo {
  id: string;
  owner_type: string;
  owner_id: string;
  file_path: string;
}

export interface WindowTreatment {
  id?: string;
  width_mm: number;
  height_mm: number;
  product: "curtain" | "roller_blind" | "pleated_blind" | "venetian_blind" | "";
  fabric_colour_sample: string;
  frame_reveal_depth_mm: number | null;
  operating_side: "left" | "right" | "";
  operating_type: "chain" | "cordless" | "handle" | "motorised" | "";
  profile_colour: string;
  window_opening_direction: "fixed" | "tilt_and_turn" | "inward" | "outward" | "";
  mounting: "wall" | "ceiling" | "recess" | "";
  note: string;
  photos?: Photo[];
  /** Base64 data: URLs staged on-device, sent with the visit and cleared once saved. */
  new_photos?: string[];
}

export interface FlooringSection {
  id?: string;
  length_m: number;
  width_m: number;
  subfloor_type: "concrete" | "wood" | "tile" | "existing_floor_covering" | "";
  levelling_required: boolean;
  underfloor_heating_present: boolean;
  laying_direction: string;
  sound_insulation_requirement: string;
  note: string;
  area_m2?: number;
  photos?: Photo[];
  new_photos?: string[];
}

export interface InsectScreen {
  id?: string;
  width_mm: number;
  height_mm: number;
  mount_type: "surface" | "recess" | "";
  window_door_type: "turn_window" | "sliding_window" | "door" | "roof_window" | "";
  opening_direction: string;
  frame_reveal_depth_mm: number | null;
  profile_colour: string;
  mesh_sample: string;
  operating_side: "left" | "right" | "";
  mounting_surface: string;
  note: string;
  photos?: Photo[];
  new_photos?: string[];
}

export interface SunShading {
  id?: string;
  width_mm: number;
  height_projection_mm: number;
  mounting_surface: "masonry_concrete" | "timber_facade" | "under_gutter" | "frame" | "";
  obstacles: string;
  wind_resistance: string;
  fabric_colour_sample: string;
  housing_arm_colour_sample: string;
  mounting_height_mm: number | null;
  note: string;
  photos?: Photo[];
  new_photos?: string[];
}

export interface Room {
  id?: string;
  name: string;
  window_treatments: WindowTreatment[];
  flooring_sections: FlooringSection[];
  insect_screens: InsectScreen[];
  sun_shadings: SunShading[];
}

export interface VisitInput {
  customer_name: string;
  address: string;
  postal_code: string;
  city: string;
  phone: string;
  email: string;
  visit_date: string; // YYYY-MM-DD
  surveyor_name: string;
  property_notes: string;
  rooms: Room[];
}

export interface Visit extends VisitInput {
  id: string;
  created_at: string;
  updated_at: string;
  email_sent: boolean;
  email_error: string | null;
}

export interface VisitListItem {
  id: string;
  customer_name: string;
  address: string;
  city: string;
  visit_date: string;
  surveyor_name: string;
  created_at: string;
  email_sent: boolean;
}

export type MeasurementCategory =
  | "window_treatment"
  | "flooring_section"
  | "insect_screen"
  | "sun_shading";
