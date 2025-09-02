'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

// Define block types with their properties
interface BlockProperty {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'color' | 'slider';
  defaultValue: any;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

interface HTMLBlock {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  html: string;
  css: string;
  js: string;
  properties: BlockProperty[];
}

// Enhanced HTML blocks with editable properties
const htmlBlocks: HTMLBlock[] = [
  {
    id: 'date-slider',
    name: 'Date Slider',
    category: 'Interactive',
    description: 'Animated date slider with customizable steps and content',
    preview: '📅 Interactive Date Slider',
         html: `<div class="wrapper">
 <div class="slick-wrap">
   {{slides}}
 </div>
 </div>`,
         css: `@charset 'UTF-8';
@import url('https://fonts.googleapis.com/css?family=Six+Caps&display=swap');

/* Slick Carousel Core Styles - FORCE HORIZONTAL */
.slick-slider {
  position: relative;
  display: block;
  box-sizing: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -ms-touch-action: pan-y;
  touch-action: pan-y;
  -webkit-tap-highlight-color: transparent;
  background: {{background_color}} !important;
}

.slick-list {
  position: relative;
  display: block;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background: {{background_color}} !important;
}

.slick-list:focus {
  outline: none;
}

.slick-list.draggable {
  cursor: pointer;
  cursor: hand;
}

.slick-track,
.slick-list {
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

.slick-track {
  position: relative;
  top: 0;
  left: 0;
  display: block;
  margin-left: auto;
  margin-right: auto;
  background: {{background_color}} !important;
}

.slick-track:before,
.slick-track:after {
  display: table;
  content: '';
}

.slick-track:after {
  clear: both;
}

.slick-loading .slick-track {
  visibility: hidden;
}

.slick-slide {
  display: none;
  float: left;
  height: 100%;
  min-height: 1px;
  background: {{background_color}} !important;
}

[dir='rtl'] .slick-slide {
  float: right;
}

.slick-slide img {
  display: block;
}

.slick-slide.slick-loading img {
  display: none;
}

.slick-slide.dragging img {
  pointer-events: none;
}

.slick-initialized .slick-slide {
  display: block;
}

.slick-loading .slick-slide {
  visibility: hidden;
}

/* VERTICAL SLIDER STYLES */
.slick-vertical .slick-slide {
  display: block;
  height: auto;
  border: 1px solid transparent;
}

.slick-vertical .slick-track {
  display: block;
}

.slick-vertical .slick-list {
  height: {{item_height}}px;
}

/* HORIZONTAL SLIDER STYLES */
.slick-horizontal .slick-slide {
  display: none;
  float: left;
  height: 100%;
  min-height: 1px;
}

.slick-horizontal .slick-track {
  display: block;
}

.slick-arrow.slick-hidden {
  display: none;
}

/* Slick Theme Styles */
.slick-prev,
.slick-next {
  font-size: 0;
  line-height: 0;
  position: absolute;
  top: 50%;
  display: block;
  width: 20px;
  height: 20px;
  padding: 0;
  -webkit-transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
  transform: translate(0, -50%);
  cursor: pointer;
  color: transparent;
  border: none;
  outline: none;
  background: transparent;
}

.slick-prev:hover,
.slick-prev:focus,
.slick-next:hover,
.slick-next:focus {
  color: transparent;
  outline: none;
  background: transparent;
}

.slick-prev:hover:before,
.slick-prev:focus:before,
.slick-next:hover:before,
.slick-next:focus:before {
  opacity: 1;
}

.slick-prev.slick-disabled:before,
.slick-next.slick-disabled:before {
  opacity: .25;
}

.slick-prev:before,
.slick-next:before {
  font-family: 'slick';
  font-size: 20px;
  line-height: 1;
  opacity: .75;
  color: white;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* HORIZONTAL ARROWS */
.slick-horizontal .slick-prev {
  left: -30px;
}

.slick-horizontal .slick-next {
  right: -30px;
}

.slick-horizontal .slick-prev:before {
  content: '\\2B9C';
}

.slick-horizontal .slick-next:before {
  content: '\\2B9E';
}

/* VERTICAL ARROWS */
.slick-vertical .slick-prev {
  top: -30px;
  left: 50%;
  transform: translate(-50%, 0);
}

.slick-vertical .slick-next {
  bottom: -30px;
  left: 50%;
  transform: translate(-50%, 0);
}

.slick-vertical .slick-prev:before {
  content: '\\2B9E';
  transform: rotate(-90deg);
}

.slick-vertical .slick-next:before {
  content: '\\2B9C';
  transform: rotate(-90deg);
}

/* RTL SUPPORT */
[dir='rtl'] .slick-horizontal .slick-prev {
  right: -30px;
  left: auto;
}

[dir='rtl'] .slick-horizontal .slick-next {
  right: auto;
  left: -30px;
}

[dir='rtl'] .slick-horizontal .slick-prev:before {
  content: '\\2B9E';
}

[dir='rtl'] .slick-horizontal .slick-next:before {
  content: '\\2B9C';
}

/* Dots */
.slick-dotted.slick-slider {
  margin-bottom: 30px;
}

.slick-dots {
  position: absolute;
  bottom: -30px;
  display: block;
  width: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
  text-align: center;
}

/* VERTICAL DOTS - Hide for vertical sliders */
.slick-vertical .slick-dots {
  display: none;
}

.slick-dots li {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: 0 5px;
  padding: 0;
  cursor: pointer;
}

.slick-dots li button {
  font-size: 0;
  line-height: 0;
  display: block;
  width: 20px;
  height: 20px;
  padding: 5px;
  cursor: pointer;
  color: transparent;
  border: 0;
  outline: none;
  background: transparent;
}

.slick-dots li button:hover,
.slick-dots li button:focus {
  outline: none;
}

.slick-dots li button:hover:before,
.slick-dots li button:focus:before {
  opacity: 1;
}

.slick-dots li button:before {
  font-family: 'slick';
  font-size: 6px;
  line-height: 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  content: '•';
  text-align: center;
  opacity: .25;
  color: black;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.slick-dots li.slick-active button:before {
  opacity: .75;
  color: black;
}

* {
  background: {{background_color}} !important;
}
body {
  font-family: 'Open sans';
  max-width: 1170px;
  margin:0 auto;
  background: {{background_color}} !important;
  color: white !important;
}
.wrapper {
  padding: {{padding_top}}px 0;
  background: {{background_color}} !important;
  width: 100% !important;
  min-height: 100vh !important;
}
.slick-wrap {
  background: {{background_color}} !important;
  width: 100% !important;
}
.slick-slider {
  background: {{background_color}} !important;
  width: 100% !important;
}

/* FORCE HORIZONTAL AFTER SLICK INITIALIZES */
.slick-initialized .slick-slide {
  display: block;
}
.process-item {
  max-width: {{item_width}}px;
  height:{{item_height}}px;
  display: flex!important;
  flex-flow: column;
  justify-content: flex-end;
  background: {{background_color}} !important;
  flex-shrink: 0 !important;
  margin-right: 20px !important;
}

/* VERTICAL SLIDER PROCESS ITEMS */
.slick-vertical .process-item {
  margin-right: 0 !important;
  margin-bottom: 20px !important;
  width: 100% !important;
  max-width: none !important;
}

/* RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .wrapper {
    padding: 50px 0 !important;
  }
  
  .process-item {
    max-width: 100% !important;
    height: 400px !important;
    margin-right: 10px !important;
    padding: 20px !important;
  }
  
  .process-item b {
    font-size: 120px !important;
    margin-bottom: 20px !important;
  }
  
  .process-item h4 {
    font-size: 24px !important;
    margin: 15px 0 20px !important;
  }
  
  .process-item p {
    font-size: 14px !important;
    line-height: 20px !important;
  }
  
  /* Mobile arrows */
  .slick-prev, .slick-next {
    width: 30px !important;
    height: 30px !important;
  }
  
  .slick-prev:before, .slick-next:before {
    font-size: 24px !important;
  }
  
  .slick-horizontal .slick-prev {
    left: -15px !important;
  }
  
  .slick-horizontal .slick-next {
    right: -15px !important;
  }
  
  .slick-vertical .slick-prev {
    top: -15px !important;
  }
  
  .slick-vertical .slick-next {
    bottom: -15px !important;
  }
  
  /* Mobile dots */
  .slick-dots {
    bottom: -20px !important;
  }
  
  .slick-dots li {
    width: 15px !important;
    height: 15px !important;
    margin: 0 3px !important;
  }
  
  .slick-dots li button {
    width: 15px !important;
    height: 15px !important;
    padding: 3px !important;
  }
  
  .slick-dots li button:before {
    font-size: 4px !important;
    line-height: 15px !important;
  }
}

@media (max-width: 480px) {
  .wrapper {
    padding: 30px 0 !important;
  }
  
  .process-item {
    height: 350px !important;
    margin-right: 5px !important;
    padding: 15px !important;
  }
  
  .process-item b {
    font-size: 80px !important;
    margin-bottom: 15px !important;
  }
  
  .process-item h4 {
    font-size: 20px !important;
    margin: 10px 0 15px !important;
  }
  
  .process-item p {
    font-size: 12px !important;
    line-height: 18px !important;
  }
  
  /* Smaller mobile arrows */
  .slick-prev, .slick-next {
    width: 25px !important;
    height: 25px !important;
  }
  
  .slick-prev:before, .slick-next:before {
    font-size: 20px !important;
  }
  
  .slick-horizontal .slick-prev {
    left: -10px !important;
  }
  
  .slick-horizontal .slick-next {
    right: -10px !important;
  }
  
  .slick-vertical .slick-prev {
    top: -10px !important;
  }
  
  .slick-vertical .slick-next {
    bottom: -10px !important;
  }
}
.process-item b {
  font-size: {{number_size}}px;
  letter-spacing: 4.2px;
  text-transform: uppercase;
  font: 900 {{number_size}}px/{{number_size}}px 'Six Caps', sans-serif;
  letter-spacing: 5px;
  position: relative;
  line-height: 1;
  color: {{number_color}};
  display: block;
  padding: 0 0 24px;
  margin: 0 0 31px;
  border-bottom: 2px solid {{border_color}};
  -webkit-transition: font-size .4s ease;
  transition: font-size .4s ease;
}
.process-item h4 {
  font-size: {{title_size}}px;
  color:{{title_color}};
  margin:20px 0 25px;
}
.slick-slide.slick-current.slick-active b {
  font-size:{{active_number_size}}px;
}
.slick-slide.slick-active b {
  font-size:{{number_size}}px;
}
.slick-current+div+div .process-item b {
   font-size:{{inactive_number_size}}px;
}
.process-item p {
  color:{{text_color}};
  line-height: 24px;
}

.slick-list.draggable {
/*   cursor: ew-resize; */
}
/* Arrows */
.slick-prev,
.slick-next
{
    font-size: 0;
    line-height: 0;
    position: absolute;
    top: 50%;
    display: block;
    width: 20px;
    height: 20px;
    padding: 0;
    -webkit-transform: translate(0, -50%);
    -ms-transform: translate(0, -50%);
    transform: translate(0, -50%);
    cursor: pointer;
    color: transparent;
    border: none;
    outline: none;
    background: transparent;
}
.slick-prev:hover,
.slick-prev:focus,
.slick-next:hover,
.slick-next:focus
{
    color: transparent;
    outline: none;
    background: transparent;
}
.slick-prev:hover:before,
.slick-prev:focus:before,
.slick-next:hover:before,
.slick-next:focus:before
{
    opacity: 1;
}
.slick-prev.slick-disabled:before,
.slick-next.slick-disabled:before
{
    opacity: .25;
}

.slick-prev:before,
.slick-next:before
{
    font-family: 'slick';
    font-size: 20px;
    line-height: 1;
    opacity: .75;
    color: white;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.slick-prev
{
    left: -30px;
}
[dir='rtl'] .slick-prev
{
    right: -30px;
    left: auto;
}
.slick-prev:before
{
    content: '\\2B9C';
}
[dir='rtl'] .slick-prev:before
{
    content: '\\2B9E';
}

.slick-next
{
    right: -30px;
}
[dir='rtl'] .slick-next
{
    right: auto;
    left: -30px;
}
.slick-next:before
{
    content: '\\2B9E';
}
[dir='rtl'] .slick-next:before
{
    content: '\\2B9C';
}

/* Dots */
.slick-dotted.slick-slider
{
    margin-bottom: 30px;
}

.slick-dots
{
    position: absolute;
    bottom: -30px;
    display: block;
    width: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
    text-align: center;
}
.slick-dots li
{
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    margin: 0 5px;
    padding: 0;
    cursor: pointer;
}
.slick-dots li button
{
    font-size: 0;
    line-height: 0;
    display: block;
    width: 20px;
    height: 20px;
    padding: 5px;
    cursor: pointer;
    color: transparent;
    border: 0;
    outline: none;
    background: transparent;
}
.slick-dots li button:hover,
.slick-dots li button:focus
{
    outline: none;
}
.slick-dots li button:hover:before,
.slick-dots li button:focus:before
{
    opacity: 1;
}
.slick-dots li button:before
{
    font-family: 'slick';
    font-size: 6px;
    line-height: 20px;
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    content: '•';
    text-align: center;
    opacity: .25;
    color: black;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.slick-dots li.slick-active button:before
{
    opacity: .75;
    color: black;
}`,
         js: `(function() {
  // Load jQuery if not already loaded
  if (typeof window.jQuery === 'undefined') {
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    jqueryScript.onload = function() {
      loadSlick();
    };
    document.head.appendChild(jqueryScript);
  } else {
    loadSlick();
  }

  function loadSlick() {
    if (typeof window.jQuery.fn.slick === 'undefined') {
      const slickScript = document.createElement('script');
      slickScript.src = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js';
      slickScript.onload = function() {
        setTimeout(initializeSlider, 200);
      };
      document.head.appendChild(slickScript);
    } else {
      setTimeout(initializeSlider, 200);
    }
  }

  function initializeSlider() {
    if (window.jQuery && window.jQuery.fn.slick) {
      const isVertical = '{{orientation}}' === 'vertical';
      const baseSlidesToShow = parseInt('{{slides_to_show}}');
      
      window.jQuery('.slick-wrap').slick({
        infinite: {{infinite}} === 'true' || {{infinite}} === true,
        autoplay: {{autoplay}} === 'true' || {{autoplay}} === true,
        autoplaySpeed: {{autoplay_speed}},
        slidesToShow: baseSlidesToShow,
        slidesToScroll: parseInt('{{slides_to_scroll}}'),
        arrows: true,
        dots: !isVertical, // Hide dots for vertical sliders
        centerMode: false,
        variableWidth: false,
        adaptiveHeight: false,
        vertical: isVertical,
        verticalSwiping: isVertical,
        pauseOnHover: true,
        pauseOnFocus: true,
        swipe: true,
        touchMove: true,
        accessibility: true,
        focusOnSelect: false,
        draggable: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: Math.min(baseSlidesToShow, 3),
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: Math.min(baseSlidesToShow, 2),
              slidesToScroll: 1,
              arrows: true,
              dots: !isVertical
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: true,
              dots: !isVertical
            }
          }
        ]
      });
    }
  }
})();`,
         properties: [
       // Dynamic slides
       { key: 'slide_count', label: 'Number of Slides', type: 'slider', defaultValue: 6, min: 2, max: 12, step: 1 },
       { key: 'slides', label: 'Slides', type: 'textarea', defaultValue: '' },
       
       // Styling
       { key: 'background_color', label: 'Background Color', type: 'color', defaultValue: '#000000' },
       { key: 'number_color', label: 'Number Color', type: 'color', defaultValue: '#ffcc00' },
       { key: 'title_color', label: 'Title Color', type: 'color', defaultValue: '#ffffff' },
       { key: 'text_color', label: 'Text Color', type: 'color', defaultValue: '#ffffff' },
       { key: 'border_color', label: 'Border Color', type: 'color', defaultValue: '#f4f4f4' },
       
       // Sizing
       { key: 'padding_top', label: 'Top Padding', type: 'slider', defaultValue: 150, min: 50, max: 300, step: 10 },
       { key: 'item_width', label: 'Item Width', type: 'slider', defaultValue: 270, min: 200, max: 400, step: 10 },
       { key: 'item_height', label: 'Item Height', type: 'slider', defaultValue: 550, min: 400, max: 700, step: 10 },
       { key: 'number_size', label: 'Number Size', type: 'slider', defaultValue: 220, min: 100, max: 300, step: 10 },
       { key: 'active_number_size', label: 'Active Number Size', type: 'slider', defaultValue: 280, min: 200, max: 400, step: 10 },
       { key: 'inactive_number_size', label: 'Inactive Number Size', type: 'slider', defaultValue: 160, min: 100, max: 250, step: 10 },
       { key: 'title_size', label: 'Title Size', type: 'slider', defaultValue: 32, min: 20, max: 50, step: 2 },
       
       // Slider settings
       { key: 'orientation', label: 'Slider Orientation', type: 'select', defaultValue: 'horizontal', options: [{ value: 'horizontal', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' }] },
       { key: 'infinite', label: 'Infinite Loop', type: 'select', defaultValue: 'false', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
       { key: 'autoplay', label: 'Autoplay', type: 'select', defaultValue: 'false', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
       { key: 'autoplay_speed', label: 'Autoplay Speed (ms)', type: 'slider', defaultValue: 3000, min: 1000, max: 10000, step: 500 },
       { key: 'slides_to_show', label: 'Slides to Show', type: 'slider', defaultValue: 3, min: 1, max: 6, step: 1 },
       { key: 'slides_to_scroll', label: 'Slides to Scroll', type: 'slider', defaultValue: 1, min: 1, max: 3, step: 1 },
     ]
  },
  {
    id: 'hero-section',
    name: 'Hero Section',
    category: 'Layout',
    description: 'Modern hero section with customizable content and styling',
    preview: '🎯 Hero Section',
    html: `<section class="hero-section" style="background: linear-gradient(135deg, {{bg_color_1}}, {{bg_color_2}});">
  <div class="hero-container">
    <h1 class="hero-title" style="color: {{title_color}}; font-size: {{title_size}}px;">{{title}}</h1>
    <p class="hero-subtitle" style="color: {{subtitle_color}}; font-size: {{subtitle_size}}px;">{{subtitle}}</p>
    <div class="hero-buttons">
      <a href="{{button1_url}}" class="hero-btn primary" style="background: {{button1_color}}; color: {{button1_text_color}};">{{button1_text}}</a>
      <a href="{{button2_url}}" class="hero-btn secondary" style="background: {{button2_color}}; color: {{button2_text_color}};">{{button2_text}}</a>
    </div>
  </div>
</section>`,
    css: `.hero-section {
  min-height: {{section_height}}px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: {{padding}}px 20px;
  text-align: center;
}

.hero-container {
  max-width: {{container_width}}px;
  margin: 0 auto;
}

.hero-title {
  font-weight: {{title_weight}};
  margin-bottom: {{title_margin}}px;
  line-height: 1.2;
}

.hero-subtitle {
  margin-bottom: {{subtitle_margin}}px;
  line-height: 1.6;
  max-width: {{subtitle_width}}px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  gap: {{button_gap}}px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  padding: {{button_padding_y}}px {{button_padding_x}}px;
  border-radius: {{button_radius}}px;
  text-decoration: none;
  font-weight: {{button_weight}};
  font-size: {{button_size}}px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-block;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.hero-btn.primary {
  background: {{button1_color}};
}

.hero-btn.secondary {
  background: {{button2_color}};
}`,
    js: '',
    properties: [
      { key: 'title', label: 'Title', type: 'text', defaultValue: 'Welcome to Our Platform' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea', defaultValue: 'Build amazing experiences with our powerful tools and intuitive interface.' },
      { key: 'button1_text', label: 'Primary Button Text', type: 'text', defaultValue: 'Get Started' },
      { key: 'button1_url', label: 'Primary Button URL', type: 'text', defaultValue: '#' },
      { key: 'button2_text', label: 'Secondary Button Text', type: 'text', defaultValue: 'Learn More' },
      { key: 'button2_url', label: 'Secondary Button URL', type: 'text', defaultValue: '#' },
      { key: 'bg_color_1', label: 'Background Color 1', type: 'color', defaultValue: '#667eea' },
      { key: 'bg_color_2', label: 'Background Color 2', type: 'color', defaultValue: '#764ba2' },
      { key: 'title_color', label: 'Title Color', type: 'color', defaultValue: '#ffffff' },
      { key: 'subtitle_color', label: 'Subtitle Color', type: 'color', defaultValue: '#f8f9fa' },
      { key: 'button1_color', label: 'Primary Button Color', type: 'color', defaultValue: '#007bff' },
      { key: 'button1_text_color', label: 'Primary Button Text Color', type: 'color', defaultValue: '#ffffff' },
      { key: 'button2_color', label: 'Secondary Button Color', type: 'color', defaultValue: '#6c757d' },
      { key: 'button2_text_color', label: 'Secondary Button Text Color', type: 'color', defaultValue: '#ffffff' },
      { key: 'section_height', label: 'Section Height', type: 'slider', defaultValue: 600, min: 400, max: 800, step: 50 },
      { key: 'container_width', label: 'Container Width', type: 'slider', defaultValue: 1200, min: 800, max: 1400, step: 50 },
      { key: 'title_size', label: 'Title Size', type: 'slider', defaultValue: 48, min: 24, max: 72, step: 4 },
      { key: 'subtitle_size', label: 'Subtitle Size', type: 'slider', defaultValue: 18, min: 14, max: 24, step: 2 },
      { key: 'button_size', label: 'Button Text Size', type: 'slider', defaultValue: 16, min: 12, max: 20, step: 2 },
      { key: 'padding', label: 'Section Padding', type: 'slider', defaultValue: 80, min: 40, max: 120, step: 10 },
      { key: 'title_margin', label: 'Title Bottom Margin', type: 'slider', defaultValue: 20, min: 10, max: 40, step: 5 },
      { key: 'subtitle_margin', label: 'Subtitle Bottom Margin', type: 'slider', defaultValue: 30, min: 15, max: 50, step: 5 },
      { key: 'subtitle_width', label: 'Subtitle Max Width', type: 'slider', defaultValue: 600, min: 400, max: 800, step: 50 },
      { key: 'button_gap', label: 'Button Gap', type: 'slider', defaultValue: 20, min: 10, max: 40, step: 5 },
      { key: 'button_padding_x', label: 'Button Padding X', type: 'slider', defaultValue: 30, min: 20, max: 50, step: 5 },
      { key: 'button_padding_y', label: 'Button Padding Y', type: 'slider', defaultValue: 15, min: 10, max: 25, step: 5 },
      { key: 'button_radius', label: 'Button Border Radius', type: 'slider', defaultValue: 8, min: 0, max: 20, step: 2 },
      { key: 'title_weight', label: 'Title Font Weight', type: 'select', defaultValue: '700', options: [
        { value: '300', label: 'Light' },
        { value: '400', label: 'Normal' },
        { value: '500', label: 'Medium' },
        { value: '600', label: 'Semi Bold' },
        { value: '700', label: 'Bold' },
        { value: '800', label: 'Extra Bold' },
        { value: '900', label: 'Black' }
      ]},
      { key: 'button_weight', label: 'Button Font Weight', type: 'select', defaultValue: '600', options: [
        { value: '400', label: 'Normal' },
        { value: '500', label: 'Medium' },
        { value: '600', label: 'Semi Bold' },
        { value: '700', label: 'Bold' }
      ]}
    ]
  }
];

interface HTMLBlocksEnhancedProps {
  onInsertBlock: (html: string, css: string, js: string) => void;
}

export default function HTMLBlocksEnhanced({ onInsertBlock }: HTMLBlocksEnhancedProps) {
  const [selectedBlock, setSelectedBlock] = useState<HTMLBlock | null>(null);
  const [blockProperties, setBlockProperties] = useState<Record<string, any>>({});
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  const categories = Array.from(new Set(htmlBlocks.map(block => block.category)));

  const handleBlockSelect = (block: HTMLBlock) => {
    setSelectedBlock(block);
    // Initialize properties with default values
    const initialProps: Record<string, any> = {};
    block.properties.forEach(prop => {
      initialProps[prop.key] = prop.defaultValue;
    });
    
    // Generate default slides for date slider
    if (block.id === 'date-slider') {
      const slideCount = initialProps.slide_count || 6;
      const defaultSlides = generateDefaultSlides(slideCount);
      initialProps.slides = defaultSlides;
    }
    
    setBlockProperties(initialProps);
  };

  const generateDefaultSlides = (count: number): string => {
    const slides = [];
    for (let i = 1; i <= count; i++) {
      const num = i.toString().padStart(2, '0');
      const titles = ['Identificare', 'Cercetare', 'Mockup Design', 'Design', 'Test', 'Loripsum', 'Development', 'Launch', 'Optimize', 'Scale', 'Maintain', 'Innovate'];
      const title = titles[i - 1] || `Step ${i}`;
      slides.push(`<div class="process-item">
  <b>${num}</b>
  <h4>${title}</h4>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Zenonis est, inquam, hoc Stoici. Falli igitur possumus.</p>
</div>`);
    }
    return slides.join('\n');
  };

  const handlePropertyChange = (key: string, value: any) => {
    setBlockProperties(prev => {
      const newProps = {
        ...prev,
        [key]: value
      };
      
      // Regenerate slides when slide count changes
      if (key === 'slide_count' && selectedBlock?.id === 'date-slider') {
        newProps.slides = generateDefaultSlides(value);
      }
      
      return newProps;
    });
  };

  const renderPropertyInput = (property: BlockProperty) => {
    const value = blockProperties[property.key] ?? property.defaultValue;

    switch (property.type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handlePropertyChange(property.key, e.target.value)}
            placeholder={property.label}
          />
        );
             case 'textarea':
         if (property.key === 'slides') {
           return (
             <div className="space-y-2">
               <div className="flex justify-between items-center">
                 <Label className="text-sm font-medium">Slide Content</Label>
                 <Button
                   type="button"
                   variant="outline"
                   size="sm"
                   onClick={() => {
                     const count = blockProperties.slide_count || 6;
                     const newSlides = generateDefaultSlides(count);
                     handlePropertyChange('slides', newSlides);
                   }}
                 >
                   Reset to Default
                 </Button>
               </div>
               <Textarea
                 value={value}
                 onChange={(e) => handlePropertyChange(property.key, e.target.value)}
                 placeholder="Edit slide HTML content here..."
                 rows={8}
                 className="font-mono text-xs"
               />
               <p className="text-xs text-gray-500">
                 Each slide should be wrapped in &lt;div class="process-item"&gt;...&lt;/div&gt;
               </p>
             </div>
           );
         }
         return (
           <Textarea
             value={value}
             onChange={(e) => handlePropertyChange(property.key, e.target.value)}
             placeholder={property.label}
             rows={3}
           />
         );
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handlePropertyChange(property.key, Number(e.target.value))}
            placeholder={property.label}
            min={property.min}
            max={property.max}
            step={property.step}
          />
        );
      case 'slider':
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{property.min}</span>
              <span className="font-medium">{value}</span>
              <span>{property.max}</span>
            </div>
            <Slider
              value={[value]}
              onValueChange={(values) => handlePropertyChange(property.key, values[0])}
              min={property.min}
              max={property.max}
              step={property.step}
              className="w-full"
            />
          </div>
        );
      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={value}
              onChange={(e) => handlePropertyChange(property.key, e.target.value)}
              className="w-12 h-8 p-1"
            />
            <Input
              value={value}
              onChange={(e) => handlePropertyChange(property.key, e.target.value)}
              placeholder={property.label}
              className="flex-1"
            />
          </div>
        );
      case 'select':
        return (
          <Select value={value} onValueChange={(val) => handlePropertyChange(property.key, val)}>
            <SelectTrigger>
              <SelectValue placeholder={property.label} />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  const processTemplate = (template: string, properties: Record<string, any>): string => {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return properties[key] ?? match;
    });
  };

  const handleInsertBlock = () => {
    if (!selectedBlock) return;

    const processedHTML = processTemplate(selectedBlock.html, blockProperties);
    const processedCSS = processTemplate(selectedBlock.css, blockProperties);
    const processedJS = processTemplate(selectedBlock.js, blockProperties);

    onInsertBlock(processedHTML, processedCSS, processedJS);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">HTML Blocks</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCodeEditor(!showCodeEditor)}
        >
          {showCodeEditor ? 'Hide' : 'Show'} Code Editor
        </Button>
      </div>

      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {htmlBlocks
                .filter(block => block.category === category)
                .map(block => (
                  <Card key={block.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{block.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {block.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {block.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl mb-2">{block.preview}</div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleBlockSelect(block)}
                          >
                            Customize & Insert
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{block.name}</DialogTitle>
                            <DialogDescription>
                              Customize the properties below and insert into your page
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Properties Panel */}
                            <div className="space-y-4">
                              <h4 className="font-medium">Properties</h4>
                              <div className="space-y-4 max-h-96 overflow-y-auto">
                                {selectedBlock?.properties.map(property => (
                                  <div key={property.key} className="space-y-2">
                                    <Label htmlFor={property.key} className="text-sm font-medium">
                                      {property.label}
                                    </Label>
                                    {renderPropertyInput(property)}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Code Preview Panel */}
                            <div className="space-y-4">
                              <h4 className="font-medium">Code Preview</h4>
                              {showCodeEditor && (
                                <Tabs defaultValue="html" className="w-full">
                                  <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="html">HTML</TabsTrigger>
                                    <TabsTrigger value="css">CSS</TabsTrigger>
                                    <TabsTrigger value="js">JS</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="html" className="mt-2">
                                    <Textarea
                                      value={selectedBlock ? processTemplate(selectedBlock.html, blockProperties) : ''}
                                      readOnly
                                      className="font-mono text-xs h-32"
                                    />
                                  </TabsContent>
                                  <TabsContent value="css" className="mt-2">
                                    <Textarea
                                      value={selectedBlock ? processTemplate(selectedBlock.css, blockProperties) : ''}
                                      readOnly
                                      className="font-mono text-xs h-32"
                                    />
                                  </TabsContent>
                                  <TabsContent value="js" className="mt-2">
                                    <Textarea
                                      value={selectedBlock ? processTemplate(selectedBlock.js, blockProperties) : ''}
                                      readOnly
                                      className="font-mono text-xs h-32"
                                    />
                                  </TabsContent>
                                </Tabs>
                              )}
                              <div className="text-sm text-gray-600">
                                <p>This block will be inserted with your custom properties applied.</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => setSelectedBlock(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleInsertBlock}>
                              Insert Block
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
