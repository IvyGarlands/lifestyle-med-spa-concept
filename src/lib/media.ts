/**
 * media.ts — one place that maps content entries to their imported images.
 *
 * `astro:assets` needs a real static import to do its work (hashing, AVIF/WebP
 * generation, intrinsic dimensions), so images cannot be referenced by a string
 * path out of a content collection. Rather than repeat ten imports on every
 * page that shows the team, they are collected here once and keyed by the
 * collection entry's id.
 *
 * Every file in src/assets/images is the practice's own: the portraits and the
 * treatment photography come from their live site, and the city photographs are
 * the ones they already use on their own service-area pages.
 */
import type { ImageMetadata } from "astro";

import michaelRankin from "../assets/images/team/michael-rankin.png";
import kimBarrus from "../assets/images/team/kim-barrus.png";
import bethBarrus from "../assets/images/team/beth-barrus.png";
import kristinaDino from "../assets/images/team/kristina-dino.png";
import anjmunSharma from "../assets/images/team/anjmun-sharma.png";
import traciBabcock from "../assets/images/team/traci-babcock.png";
import jessicaSalazar from "../assets/images/team/jessica-salazar.png";
import giselleMorales from "../assets/images/team/giselle-morales.png";
import samanthaNunley from "../assets/images/team/samantha-nunley.png";
import jaimeRaymond from "../assets/images/team/jaime-raymond.png";

/** Keyed by the `people` collection entry id (the filename without .json). */
export const TEAM_PHOTOS: Record<string, ImageMetadata> = {
  "01-rankin": michaelRankin,
  "02-kim-barrus": kimBarrus,
  "03-beth-barrus": bethBarrus,
  "04-dino": kristinaDino,
  "05-sharma": anjmunSharma,
  "06-babcock": traciBabcock,
  "07-salazar": jessicaSalazar,
  "08-morales": giselleMorales,
  "09-nunley": samanthaNunley,
  "10-raymond": jaimeRaymond,
};

export { default as imgHeroCutout } from "../assets/images/treatments/hero-cutout.png";
export { default as imgWeightLoss } from "../assets/images/treatments/weight-loss.png";
export { default as imgTreatments } from "../assets/images/treatments/treatments.png";
export { default as imgWhyChoose } from "../assets/images/treatments/why-choose.png";
export { default as imgHydrafacial } from "../assets/images/treatments/hydrafacial.png";
export { default as imgHydrafacialWhy } from "../assets/images/treatments/hydrafacial-why.png";
export { default as imgFacialCleanse } from "../assets/images/treatments/facial-cleanse.png";
export { default as imgHydration } from "../assets/images/treatments/hydration.png";
export { default as imgExtraction } from "../assets/images/treatments/extraction.png";
export { default as imgAcidPeel } from "../assets/images/treatments/acid-peel.png";
export { default as imgProtection } from "../assets/images/treatments/protection.png";
export { default as imgExfoliation } from "../assets/images/treatments/exfoliation.png";
export { default as imgZoSkin } from "../assets/images/treatments/zo-skin-health.png";
export { default as imgZoBanner } from "../assets/images/treatments/zo-banner.png";
export { default as imgCollagen } from "../assets/images/treatments/collagen-peptides.png";
export { default as imgYerbaMate } from "../assets/images/treatments/yerba-mate.png";
export { default as imgBannerA } from "../assets/images/treatments/banner-a.png";
export { default as imgBannerB } from "../assets/images/treatments/banner-b.png";
export { default as imgBannerC } from "../assets/images/treatments/banner-c.png";
export { default as imgBrochure } from "../assets/images/treatments/brochure.png";

import agouraHills from "../assets/images/cities/agoura-hills.png";
import westlakeVillage from "../assets/images/cities/westlake-village.png";
import thousandOaks from "../assets/images/cities/thousand-oaks.png";
import calabasas from "../assets/images/cities/calabasas.png";
import shermanOaks from "../assets/images/cities/sherman-oaks.png";
import encino from "../assets/images/cities/encino.png";
import malibu from "../assets/images/cities/malibu.png";
import simiValley from "../assets/images/cities/simi-valley.png";
import oxnard from "../assets/images/cities/oxnard.png";
import camarillo from "../assets/images/cities/camarillo.png";
import losAngeles from "../assets/images/cities/los-angeles.png";

export const CITY_PHOTOS: Record<string, ImageMetadata> = {
  "agoura-hills": agouraHills,
  "westlake-village": westlakeVillage,
  "thousand-oaks": thousandOaks,
  calabasas,
  "sherman-oaks": shermanOaks,
  encino,
  malibu,
  "simi-valley": simiValley,
  oxnard,
  camarillo,
  "los-angeles": losAngeles,
};
