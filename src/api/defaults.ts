import type { FlooringSection, InsectScreen, Room, SunShading, VisitInput, WindowTreatment } from "./types";

export function emptyWindowTreatment(): WindowTreatment {
  return {
    width_mm: 0,
    height_mm: 0,
    product: "",
    fabric_colour_sample: "",
    frame_reveal_depth_mm: null,
    operating_side: "",
    operating_type: "",
    profile_colour: "",
    window_opening_direction: "",
    mounting: "",
    note: "",
  };
}

export function emptyFlooringSection(): FlooringSection {
  return {
    length_m: 0,
    width_m: 0,
    subfloor_type: "",
    levelling_required: false,
    underfloor_heating_present: false,
    laying_direction: "",
    sound_insulation_requirement: "",
    note: "",
  };
}

export function emptyInsectScreen(): InsectScreen {
  return {
    width_mm: 0,
    height_mm: 0,
    mount_type: "",
    window_door_type: "",
    opening_direction: "",
    frame_reveal_depth_mm: null,
    profile_colour: "",
    mesh_sample: "",
    operating_side: "",
    mounting_surface: "",
    note: "",
  };
}

export function emptySunShading(): SunShading {
  return {
    width_mm: 0,
    height_projection_mm: 0,
    mounting_surface: "",
    obstacles: "",
    wind_resistance: "",
    fabric_colour_sample: "",
    housing_arm_colour_sample: "",
    mounting_height_mm: null,
    note: "",
  };
}

export function emptyRoom(name = ""): Room {
  return {
    name,
    window_treatments: [],
    flooring_sections: [],
    insect_screens: [],
    sun_shadings: [],
  };
}

export function emptyVisit(): VisitInput {
  return {
    customer_name: "",
    address: "",
    postal_code: "",
    city: "",
    phone: "",
    email: "",
    visit_date: new Date().toISOString().slice(0, 10),
    surveyor_name: "",
    property_notes: "",
    rooms: [emptyRoom("Room 1")],
  };
}
