import sys, torch, torch.nn as nn, torch.nn.functional as F, numpy as np
from PIL import Image
class RDB(nn.Module):
    def __init__(s, nf=64, gc=32):
        super().__init__()
        s.conv1=nn.Conv2d(nf,gc,3,1,1); s.conv2=nn.Conv2d(nf+gc,gc,3,1,1); s.conv3=nn.Conv2d(nf+2*gc,gc,3,1,1)
        s.conv4=nn.Conv2d(nf+3*gc,gc,3,1,1); s.conv5=nn.Conv2d(nf+4*gc,nf,3,1,1); s.lrelu=nn.LeakyReLU(0.2,True)
    def forward(s,x):
        x1=s.lrelu(s.conv1(x)); x2=s.lrelu(s.conv2(torch.cat((x,x1),1))); x3=s.lrelu(s.conv3(torch.cat((x,x1,x2),1)))
        x4=s.lrelu(s.conv4(torch.cat((x,x1,x2,x3),1))); x5=s.conv5(torch.cat((x,x1,x2,x3,x4),1)); return x5*0.2+x
class RRDB(nn.Module):
    def __init__(s,nf,gc=32):
        super().__init__(); s.rdb1=RDB(nf,gc); s.rdb2=RDB(nf,gc); s.rdb3=RDB(nf,gc)
    def forward(s,x): return s.rdb3(s.rdb2(s.rdb1(x)))*0.2+x
class RRDBNet(nn.Module):
    def __init__(s,nb=6,nf=64):
        super().__init__()
        s.conv_first=nn.Conv2d(3,nf,3,1,1); s.body=nn.Sequential(*[RRDB(nf) for _ in range(nb)]); s.conv_body=nn.Conv2d(nf,nf,3,1,1)
        s.conv_up1=nn.Conv2d(nf,nf,3,1,1); s.conv_up2=nn.Conv2d(nf,nf,3,1,1); s.conv_hr=nn.Conv2d(nf,nf,3,1,1); s.conv_last=nn.Conv2d(nf,3,3,1,1); s.lrelu=nn.LeakyReLU(0.2,True)
    def forward(s,x):
        f=s.conv_first(x); f=f+s.conv_body(s.body(f))
        f=s.lrelu(s.conv_up1(F.interpolate(f,scale_factor=2,mode='nearest'))); f=s.lrelu(s.conv_up2(F.interpolate(f,scale_factor=2,mode='nearest')))
        return s.conv_last(s.lrelu(s.conv_hr(f)))
m=RRDBNet(); sd=torch.load(sys.argv[1],map_location='cpu'); sd=sd.get('params_ema',sd.get('params',sd)); m.load_state_dict(sd,strict=True); m.eval()
img=np.array(Image.open(sys.argv[2]).convert('RGB')).astype(np.float32)/255; H,W,_=img.shape
out=np.zeros((H*4,W*4,3),np.float32); T,P=192,12
torch.set_num_threads(4)
with torch.no_grad():
    for y in range(0,H,T):
        for x in range(0,W,T):
            y0,x0=max(0,y-P),max(0,x-P); y1,x1=min(H,y+T+P),min(W,x+T+P)
            t=torch.from_numpy(img[y0:y1,x0:x1].transpose(2,0,1)).unsqueeze(0)
            r=m(t).clamp(0,1)[0].numpy().transpose(1,2,0)
            oy,ox=(y-y0)*4,(x-x0)*4; h,w=min(T,H-y)*4,min(T,W-x)*4
            out[y*4:y*4+h,x*4:x*4+w]=r[oy:oy+h,ox:ox+w]
        print('row',y,flush=True)
Image.fromarray((out*255+0.5).astype(np.uint8)).save(sys.argv[3])
