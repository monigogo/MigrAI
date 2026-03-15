FROM mcr.microsoft.com/devcontainers/python:3.11-bullseye

WORKDIR /workspaces

RUN rm -f /etc/apt/sources.list.d/yarn.list \
 && apt-get update \
 && apt-get install -y \
    curl \
    ffmpeg \
    libsm6 \
    libxext6 \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libpq-dev \
    gcc \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

USER root

# Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y nodejs \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

RUN curl -Ls https://astral.sh/uv/install.sh | sh \
 && mv /root/.local/bin/uv /usr/local/bin/uv

# Instala greenlet con root antes de cambiar al usuario vscode
RUN pip install greenlet

RUN mkdir -p /home/vscode/.cache/uv \
 && chown -R vscode:vscode /home/vscode/.cache

RUN chown -R vscode:vscode /usr/local/lib/python3.11/site-packages \
 && chown -R vscode:vscode /usr/local/bin \
 && chown -R vscode:vscode /usr/local/share \
 && chown -R vscode:vscode /usr/local/include  # ← línea nueva

ENV UV_SYSTEM_PYTHON=1
ENV UV_LINK_MODE=copy

USER vscode