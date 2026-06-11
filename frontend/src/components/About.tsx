import React from "react";
import { invoke } from "@tauri-apps/api/core";
import Image from "next/image";
import AnalyticsConsentSwitch from "./AnalyticsConsentSwitch";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

export function About() {
    const openExternal = async (url: string) => {
        try {
            await invoke("open_external_url", { url });
        } catch (error) {
            console.error("Failed to open link:", error);
        }
    };

    return (
        <div className="p-4 space-y-4 h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center">
                <div className="mb-3">
                    <Image
                        src="icon_128x128.png"
                        alt="Meetily Logo"
                        width={64}
                        height={64}
                        className="mx-auto"
                    />
                </div>
                <span className="text-sm text-gray-500">
                    v0.1.1 – Pre Release
                </span>
                <p className="text-medium text-gray-600 mt-1">
                    Real-time notes and summaries that never leave your machine.
                </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
                <h2 className="text-base font-semibold text-gray-800">
                    What makes Meetily different
                </h2>

                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded p-3 hover:bg-gray-100 transition-colors">
                        <h3 className="font-bold text-sm text-gray-900 mb-1">
                            Privacy-first
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Your data & AI processing workflow stays on your
                            device. No cloud, no leaks.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded p-3 hover:bg-gray-100 transition-colors">
                        <h3 className="font-bold text-sm text-gray-900 mb-1">
                            Use Any Model
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Use local open-source models or external APIs. No
                            lock-in.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded p-3 hover:bg-gray-100 transition-colors">
                        <h3 className="font-bold text-sm text-gray-900 mb-1">
                            Cost-Smart
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Avoid pay-per-minute bills by running models locally.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded p-3 hover:bg-gray-100 transition-colors">
                        <h3 className="font-bold text-sm text-gray-900 mb-1">
                            Works everywhere
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Google Meet, Zoom, Teams — online or offline.
                        </p>
                    </div>
                </div>
            </div>

            {/* Coming Soon */}
            <div className="bg-blue-50 rounded p-3">
                <p className="text-sm text-blue-800">
                    <span className="font-bold">Coming soon:</span> A library of
                    on-device AI agents for follow-ups, action tracking, and
                    more.
                </p>
            </div>

            {/* Social Links Section (REPLACEMENT FOR BLUE BUTTON) */}
            <div className="pt-6 border-t border-gray-200 text-center space-y-3">
                <p className="text-sm text-gray-500">
                    Follow Meetily & the team
                </p>

                <div className="flex justify-center gap-6">
                    <Github
                        size={22}
                        className="cursor-pointer text-gray-500 hover:text-black transition"
                        onClick={() =>
                            openExternal(
                                "https://github.com/Krish2342"
                            )
                        }
                    />

                    <Twitter
                        size={22}
                        className="cursor-pointer text-gray-500 hover:text-sky-500 transition"
                        onClick={() =>
                            openExternal("https://x.com/krishh2304")
                        }
                    />

                    <Linkedin
                        size={22}
                        className="cursor-pointer text-gray-500 hover:text-blue-600 transition"
                        onClick={() =>
                            openExternal(
                                "https://www.linkedin.com/in/gjcom23-krp7037?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                            )
                        }
                    />

                    <Instagram
                        size={22}
                        className="cursor-pointer text-gray-500 hover:text-pink-500 transition"
                        onClick={() =>
                            openExternal("https://www.instagram.com/__krishh_23?igsh=MTNxNXU4aTJjY2kyag==")
                        }
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="pt-2 text-center">
                <p className="text-xs text-gray-400">
                    Built by Krish Patel
                </p>
            </div>

            <AnalyticsConsentSwitch />
        </div>
    );
}
