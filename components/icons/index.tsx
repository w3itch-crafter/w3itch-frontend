import styled from '@emotion/styled'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import clsx from 'clsx'

export declare interface IconProps {
  size: number
  color?: string
}
const StyledSvgIcon = styled(SvgIcon)<IconProps>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  font-size: ${(p) => p.size}px;
`

export function MetaMaskIcon({ size, ...props }: SvgIconProps & IconProps) {
  return (
    <StyledSvgIcon {...props} viewBox="0 0 397 355" size={size}>
      <g fill="none" fillRule="evenodd" transform="translate(-1 -1)">
        <path
          d="m114.622644 327.195472 52.004717 13.810198v-18.05949l4.245283-4.249292h29.716982v21.246459 14.872523h-31.839624l-39.268868-16.997169z"
          fill="#cdbdb2"
        />
        <path
          d="m199.528305 327.195472 50.943397 13.810198v-18.05949l4.245283-4.249292h29.716981v21.246459 14.872523h-31.839623l-39.268868-16.997169z"
          fill="#cdbdb2"
          transform="matrix(-1 0 0 1 483.96227 0)"
        />
        <path
          d="m170.872644 287.889523-4.245283 35.056657 5.306604-4.249292h55.18868l6.367925 4.249292-4.245284-35.056657-8.490565-5.311615-42.452832 1.062323z"
          fill="#393939"
        />
        <path
          d="m142.216984 50.9915022 25.471698 59.4900858 11.674528 173.158643h41.391511l12.735849-173.158643 23.349056-59.4900858z"
          fill="#f89c35"
        />
        <path
          d="m30.7783023 181.657226-29.71698153 86.048161 74.29245393-4.249293h47.7594343v-37.181303l-2.122641-76.487253-10.613208 8.498583z"
          fill="#f89d35"
        />
        <path
          d="m87.0283032 191.218134 87.0283028 2.124646-9.551886 44.617563-41.391511-10.623229z"
          fill="#d87c30"
        />
        <path
          d="m87.0283032 192.280457 36.0849058 33.994334v33.994334z"
          fill="#ea8d3a"
        />
        <path
          d="m123.113209 227.337114 42.452831 10.623229 13.79717 45.679888-9.551886 5.311615-46.698115-27.620398z"
          fill="#f89d35"
        />
        <path
          d="m123.113209 261.331448-8.490565 65.864024 56.25-39.305949z"
          fill="#eb8f35"
        />
        <path
          d="m174.056606 193.34278 5.306604 90.297451-15.919812-46.211049z"
          fill="#ea8e3a"
        />
        <path
          d="m74.2924539 262.393771 48.8207551-1.062323-8.490565 65.864024z"
          fill="#d87c30"
        />
        <path
          d="m24.4103777 355.878193 90.2122663-28.682721-40.3301901-64.801701-73.23113313 5.311616z"
          fill="#eb8f35"
        />
        <path
          d="m167.688682 110.481588-45.636793 38.243627-35.0235858 42.492919 87.0283028 3.186969z"
          fill="#e8821e"
        />
        <path
          d="m114.622644 327.195472 56.25-39.305949-4.245283 33.994334v19.121813l-38.207548-7.43626z"
          fill="#dfcec3"
        />
        <path
          d="m229.245286 327.195472 55.18868-39.305949-4.245283 33.994334v19.121813l-38.207548-7.43626z"
          fill="#dfcec3"
          transform="matrix(-1 0 0 1 513.679252 0)"
        />
        <path
          d="m132.665096 212.464593-11.674528 24.433427 41.39151-10.623229z"
          fill="#393939"
          transform="matrix(-1 0 0 1 283.372646 0)"
        />
        <path
          d="m23.349057 1.06232296 144.339625 109.41926504-24.410378-59.4900858z"
          fill="#e88f35"
        />
        <path
          d="m23.349057 1.06232296-19.10377392 58.42776294 10.61320772 63.7393781-7.42924541 4.249292 10.61320771 9.560906-8.49056617 7.436261 11.67452847 10.623229-7.4292454 6.373938 16.9811323 21.246459 79.5990577-24.433428c38.915096-31.161473 58.018869-47.096318 57.311322-47.804533-.707548-.708215-48.820756-37.1813036-144.339625-109.41926504z"
          fill="#8e5a30"
        />
        <g transform="matrix(-1 0 0 1 399.056611 0)">
          <path
            d="m30.7783023 181.657226-29.71698153 86.048161 74.29245393-4.249293h47.7594343v-37.181303l-2.122641-76.487253-10.613208 8.498583z"
            fill="#f89d35"
          />
          <path
            d="m87.0283032 191.218134 87.0283028 2.124646-9.551886 44.617563-41.391511-10.623229z"
            fill="#d87c30"
          />
          <path
            d="m87.0283032 192.280457 36.0849058 33.994334v33.994334z"
            fill="#ea8d3a"
          />
          <path
            d="m123.113209 227.337114 42.452831 10.623229 13.79717 45.679888-9.551886 5.311615-46.698115-27.620398z"
            fill="#f89d35"
          />
          <path
            d="m123.113209 261.331448-8.490565 65.864024 55.18868-38.243626z"
            fill="#eb8f35"
          />
          <path
            d="m174.056606 193.34278 5.306604 90.297451-15.919812-46.211049z"
            fill="#ea8e3a"
          />
          <path
            d="m74.2924539 262.393771 48.8207551-1.062323-8.490565 65.864024z"
            fill="#d87c30"
          />
          <path
            d="m24.4103777 355.878193 90.2122663-28.682721-40.3301901-64.801701-73.23113313 5.311616z"
            fill="#eb8f35"
          />
          <path
            d="m167.688682 110.481588-45.636793 38.243627-35.0235858 42.492919 87.0283028 3.186969z"
            fill="#e8821e"
          />
          <path
            d="m132.665096 212.464593-11.674528 24.433427 41.39151-10.623229z"
            fill="#393939"
            transform="matrix(-1 0 0 1 283.372646 0)"
          />
          <path
            d="m23.349057 1.06232296 144.339625 109.41926504-24.410378-59.4900858z"
            fill="#e88f35"
          />
          <path
            d="m23.349057 1.06232296-19.10377392 58.42776294 10.61320772 63.7393781-7.42924541 4.249292 10.61320771 9.560906-8.49056617 7.436261 11.67452847 10.623229-7.4292454 6.373938 16.9811323 21.246459 79.5990577-24.433428c38.915096-31.161473 58.018869-47.096318 57.311322-47.804533-.707548-.708215-48.820756-37.1813036-144.339625-109.41926504z"
            fill="#8e5a30"
          />
        </g>
      </g>
    </StyledSvgIcon>
  )
}

export function WalletConnectIcon({
  size,
  ...props
}: SvgIconProps & IconProps) {
  return (
    <StyledSvgIcon {...props} viewBox="0 0 512 512" size={size}>
      <radialGradient id="a" cx="0%" cy="50%" r="100%">
        <stop offset="0" stopColor="#5d9df6" />
        <stop offset="1" stopColor="#006fff" />
      </radialGradient>
      <g fill="none" fillRule="evenodd">
        <path
          d="m256 0c141.384896 0 256 114.615104 256 256s-114.615104 256-256 256-256-114.615104-256-256 114.615104-256 256-256z"
          fill="url(#a)"
        />
        <path
          d="m64.6917558 37.7088298c51.5328072-50.2784397 135.0839942-50.2784397 186.6167992 0l6.202057 6.0510906c2.57664 2.5139218 2.57664 6.5897948 0 9.1037177l-21.215998 20.6995759c-1.288321 1.2569619-3.3771 1.2569619-4.665421 0l-8.534766-8.3270205c-35.950573-35.0754962-94.237969-35.0754962-130.188544 0l-9.1400282 8.9175519c-1.2883217 1.2569609-3.3771016 1.2569609-4.6654208 0l-21.2159973-20.6995759c-2.5766403-2.5139229-2.5766403-6.5897958 0-9.1037177zm230.4934852 42.8089117 18.882279 18.4227262c2.576627 2.5139103 2.576642 6.5897593.000032 9.1036863l-85.141498 83.070358c-2.576623 2.513941-6.754182 2.513969-9.33084.000066-.00001-.00001-.000023-.000023-.000033-.000034l-60.428256-58.957451c-.64416-.628481-1.68855-.628481-2.33271 0-.000004.000004-.000008.000007-.000012.000011l-60.4269683 58.957408c-2.5766141 2.513947-6.7541746 2.51399-9.3308408.000092-.0000151-.000014-.0000309-.000029-.0000467-.000046l-85.14386774-83.071463c-2.57663928-2.513921-2.57663928-6.589795 0-9.1037163l18.88231264-18.4226955c2.5766393-2.5139222 6.7541993-2.5139222 9.3308397 0l60.4291347 58.9582758c.6441608.62848 1.6885495.62848 2.3327103 0 .0000095-.000009.0000182-.000018.0000277-.000025l60.4261065-58.9582508c2.576581-2.51398 6.754142-2.5140743 9.33084-.0002103.000037.0000354.000072.0000709.000107.0001063l60.429056 58.9583548c.644159.628479 1.688549.628479 2.332709 0l60.428079-58.9571925c2.57664-2.5139231 6.754199-2.5139231 9.330839 0z"
          fill="#fff"
          fillRule="nonzero"
          transform="translate(98 160)"
        />
      </g>
    </StyledSvgIcon>
  )
}

export function EthereumIcon({ size, ...props }: SvgIconProps & IconProps) {
  return (
    <StyledSvgIcon {...props} viewBox="0 0 784.37 1277.39" size={size}>
      <g>
        <polygon
          fill="#343434"
          fillRule="nonzero"
          points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "
        />
        <polygon
          fill="#8C8C8C"
          fillRule="nonzero"
          points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "
        />
        <polygon
          fill="#3C3C3B"
          fillRule="nonzero"
          points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "
        />
        <polygon
          fill="#8C8C8C"
          fillRule="nonzero"
          points="392.07,1277.38 392.07,956.52 -0,724.89 "
        />
        <polygon
          fill="#141414"
          fillRule="nonzero"
          points="392.07,882.29 784.13,650.54 392.07,472.33 "
        />
        <polygon
          fill="#393939"
          fillRule="nonzero"
          points="0,650.54 392.07,882.29 392.07,472.33 "
        />
      </g>
    </StyledSvgIcon>
  )
}

export function GitHubIcon({ size, ...props }: SvgIconProps & IconProps) {
  return (
    <StyledSvgIcon
      {...props}
      viewBox="0 0 256 250"
      size={size}
      htmlColor="#161614"
    >
      <path d="M128.00106,0 C57.3172926,0 0,57.3066942 0,128.00106 C0,184.555281 36.6761997,232.535542 87.534937,249.460899 C93.9320223,250.645779 96.280588,246.684165 96.280588,243.303333 C96.280588,240.251045 96.1618878,230.167899 96.106777,219.472176 C60.4967585,227.215235 52.9826207,204.369712 52.9826207,204.369712 C47.1599584,189.574598 38.770408,185.640538 38.770408,185.640538 C27.1568785,177.696113 39.6458206,177.859325 39.6458206,177.859325 C52.4993419,178.762293 59.267365,191.04987 59.267365,191.04987 C70.6837675,210.618423 89.2115753,204.961093 96.5158685,201.690482 C97.6647155,193.417512 100.981959,187.77078 104.642583,184.574357 C76.211799,181.33766 46.324819,170.362144 46.324819,121.315702 C46.324819,107.340889 51.3250588,95.9223682 59.5132437,86.9583937 C58.1842268,83.7344152 53.8029229,70.715562 60.7532354,53.0843636 C60.7532354,53.0843636 71.5019501,49.6441813 95.9626412,66.2049595 C106.172967,63.368876 117.123047,61.9465949 128.00106,61.8978432 C138.879073,61.9465949 149.837632,63.368876 160.067033,66.2049595 C184.49805,49.6441813 195.231926,53.0843636 195.231926,53.0843636 C202.199197,70.715562 197.815773,83.7344152 196.486756,86.9583937 C204.694018,95.9223682 209.660343,107.340889 209.660343,121.315702 C209.660343,170.478725 179.716133,181.303747 151.213281,184.472614 C155.80443,188.444828 159.895342,196.234518 159.895342,208.176593 C159.895342,225.303317 159.746968,239.087361 159.746968,243.303333 C159.746968,246.709601 162.05102,250.70089 168.53925,249.443941 C219.370432,232.499507 256,184.536204 256,128.00106 C256,57.3066942 198.691187,0 128.00106,0 Z M47.9405593,182.340212 C47.6586465,182.976105 46.6581745,183.166873 45.7467277,182.730227 C44.8183235,182.312656 44.2968914,181.445722 44.5978808,180.80771 C44.8734344,180.152739 45.876026,179.97045 46.8023103,180.409216 C47.7328342,180.826786 48.2627451,181.702199 47.9405593,182.340212 Z M54.2367892,187.958254 C53.6263318,188.524199 52.4329723,188.261363 51.6232682,187.366874 C50.7860088,186.474504 50.6291553,185.281144 51.2480912,184.70672 C51.8776254,184.140775 53.0349512,184.405731 53.8743302,185.298101 C54.7115892,186.201069 54.8748019,187.38595 54.2367892,187.958254 Z M58.5562413,195.146347 C57.7719732,195.691096 56.4895886,195.180261 55.6968417,194.042013 C54.9125733,192.903764 54.9125733,191.538713 55.713799,190.991845 C56.5086651,190.444977 57.7719732,190.936735 58.5753181,192.066505 C59.3574669,193.22383 59.3574669,194.58888 58.5562413,195.146347 Z M65.8613592,203.471174 C65.1597571,204.244846 63.6654083,204.03712 62.5716717,202.981538 C61.4524999,201.94927 61.1409122,200.484596 61.8446341,199.710926 C62.5547146,198.935137 64.0575422,199.15346 65.1597571,200.200564 C66.2704506,201.230712 66.6095936,202.705984 65.8613592,203.471174 Z M75.3025151,206.281542 C74.9930474,207.284134 73.553809,207.739857 72.1039724,207.313809 C70.6562556,206.875043 69.7087748,205.700761 70.0012857,204.687571 C70.302275,203.678621 71.7478721,203.20382 73.2083069,203.659543 C74.6539041,204.09619 75.6035048,205.261994 75.3025151,206.281542 Z M86.046947,207.473627 C86.0829806,208.529209 84.8535871,209.404622 83.3316829,209.4237 C81.8013,209.457614 80.563428,208.603398 80.5464708,207.564772 C80.5464708,206.498591 81.7483088,205.631657 83.2786917,205.606221 C84.8005962,205.576546 86.046947,206.424403 86.046947,207.473627 Z M96.6021471,207.069023 C96.7844366,208.099171 95.7267341,209.156872 94.215428,209.438785 C92.7295577,209.710099 91.3539086,209.074206 91.1652603,208.052538 C90.9808515,206.996955 92.0576306,205.939253 93.5413813,205.66582 C95.054807,205.402984 96.4092596,206.021919 96.6021471,207.069023 Z" />
    </StyledSvgIcon>
  )
}

export function DiscordIcon({ size, ...props }: SvgIconProps & IconProps) {
  return (
    <StyledSvgIcon {...props} viewBox="0 0 71 55" size={size}>
      <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
    </StyledSvgIcon>
  )
}

export function CloseIcon({ size, ...props }: SvgIconProps & IconProps) {
  return (
    <StyledSvgIcon {...props} viewBox="0 0 24 24" size={size}>
      <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z" />
    </StyledSvgIcon>
  )
}

export declare interface IcoMoonIconProps {
  name: string
}
export function IcoMoonIcon({ name }: IcoMoonIconProps) {
  const Icon = styled.span``

  return (
    <Icon
      className={clsx('icon', `icon-${name}`)}
      aria-label={`icon-${name}`}
    />
  )
}

export function SortIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m304 392v48c0 4.5-3.5 8-8 8h-64c-4.5 0-8-3.5-8-8v-48c0-4.5 3.5-8 8-8h64c4.5 0 8 3.5 8 8zm-120-32c0 2.25-1 4.25-2.5 6l-79.75 79.75c-1.75 1.5-3.75 2.25-5.75 2.25s-4-0.75-5.75-2.25l-80-80c-2.25-2.5-3-5.75-1.75-8.75s4.25-5 7.5-5h48v-344c0-4.5 3.5-8 8-8h48c4.5 0 8 3.5 8 8v344h48c4.5 0 8 3.5 8 8zm168-96v48c0 4.5-3.5 8-8 8h-112c-4.5 0-8-3.5-8-8v-48c0-4.5 3.5-8 8-8h112c4.5 0 8 3.5 8 8zm48-128v48c0 4.5-3.5 8-8 8h-160c-4.5 0-8-3.5-8-8v-48c0-4.5 3.5-8 8-8h160c4.5 0 8 3.5 8 8zm48-128v48c0 4.5-3.5 8-8 8h-208c-4.5 0-8-3.5-8-8v-48c0-4.5 3.5-8 8-8h208c4.5 0 8 3.5 8 8z" />
    </SvgIcon>
  )
}
