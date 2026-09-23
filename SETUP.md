# 환경 설치

```powershell
# 1. uv 설치 (없으면)
winget install --id=astral-sh.uv -e

# 2. Python 3.12 + 가상환경
uv python install 3.12
uv venv --python 3.12 .venv

# 3. pip 준비
.venv\Scripts\python.exe -m ensurepip --upgrade


# 4. requirements.txt로 설치
.venv\Scripts\python.exe -m pip install -r requirements.txt

# 5. 확인 (torch.cuda.is_available()이 True 이고 GPU 이름이 나오는지 확인)
.venv\Scripts\python.exe -c "import tensorflow as tf, torch, torchvision, cv2, PIL, transformers, gym; print(tf.__version__, torch.__version__, cv2.__version__); print('CUDA:', torch.cuda.is_available(), torch.cuda.get_device_name(0) if torch.cuda.is_available() else '')"
```

가상환경 켜기: `.venv\Scripts\Activate.ps1`

## 참고 (requirements.txt 버전 고정 사유)

- `numpy==1.26.4`: `gym==0.25.2`가 `np.bool8`을 사용(numpy 2.0에서 제거됨)하고, `tensorflow==2.16.2`가 `numpy<2`를 요구.
- `onnx==1.17.0`: onnx 1.18+는 `ml_dtypes>=0.5`를 요구하지만 tensorflow 2.16.2가 `ml_dtypes~=0.3.1`로 고정하여 충돌 — 1.17.0은 ml_dtypes에 의존하지 않아 공존 가능.
- `gym==0.25.2`: 노트북이 구(舊) Gym API(`env.reset()` → 배열, `env.step()` → 4-튜플)를 사용. 0.25.2가 해당 API의 마지막 버전.
- `torch/torchvision/torchaudio == ...+cu130`: NVIDIA RTX 50 시리즈(Blackwell, compute capability 12.0) GPU는 CUDA 12.8 이상으로 빌드된 wheel이 있어야 GPU로 잡힙니다. 그냥 `pip install torch`만 하면 PyPI 기본 wheel(CPU 전용)이 깔리므로, `requirements.txt`의 `--extra-index-url https://download.pytorch.org/whl/cu130`과 `+cu130` 버전 고정이 반드시 함께 적용되어야 합니다.
  - 다른 GPU(구형, Blackwell이 아닌 경우)를 쓴다면 `nvidia-smi`로 확인한 드라이버가 지원하는 CUDA 버전에 맞춰 cu121/cu124/cu126 등으로 바꿔도 됩니다.
